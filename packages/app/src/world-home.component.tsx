import {
  faArrowDownToBracket,
  faArrowUpFromBracket,
  faPercent,
  faWarehouse,
} from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Fragment, useContext } from 'react'
import invariant from 'tiny-invariant'
import { Button } from './button.component.js'
import { TICKS_PER_SECOND } from './const.js'
import { Context } from './context.js'
import { Heading3 } from './heading.component.js'
import {
  countInventory,
  inventoryAdd,
  iterateInventory,
} from './inventory.js'
import { ItemLabel } from './item-label.component.js'
import { Text } from './text.component.js'
import { formatItemCount } from './util.js'
import styles from './world-home.module.scss'
import {
  Entity,
  EntityType,
  FurnaceRecipeItemType,
  Inventory,
  ItemType,
  ResourceType,
  World,
} from './world.js'

interface StoneFurnaceGroup {
  recipeItemType: FurnaceRecipeItemType
  built: number
}

interface StoneFurnaceGroupGroup {
  type: 'StoneFurnace'
  groups: StoneFurnaceGroup[]
  available: number
  totalBuilt: number
}

interface BurnerMiningDrillGroup {
  resourceType: ResourceType
  built: number
}

interface BurnerMiningDrillGroupGroup {
  type: 'BurnerMiningDrill'
  groups: BurnerMiningDrillGroup[]
  available: number
  totalBuilt: number
}

type GroupGroup =
  | StoneFurnaceGroupGroup
  | BurnerMiningDrillGroupGroup

interface ToggleEntityCountProps {
  built: number
  available: number
  onAdd(): void
  onRemove(): void
}

function ToggleEntityCount({
  built,
  available,
  onAdd,
  onRemove,
}: ToggleEntityCountProps) {
  return (
    <div className={styles['toggle-entity-count']}>
      <Button onClick={onRemove} disabled={built === 0}>
        &#xFF0D;
      </Button>
      <div className={styles['toggle-entity-count__built']}>
        <Text>{built}</Text>
      </div>
      <Button onClick={onAdd} disabled={available === 0}>
        &#xFF0B;
      </Button>
    </div>
  )
}

function mapInventory(
  inventory: Inventory,
  cb: (itemType: ItemType, count: number) => JSX.Element,
): JSX.Element[] {
  return Object.entries(inventory).map((entry) => {
    const itemType = ItemType.parse(entry[0])
    const count = entry[1]
    return cb(itemType, count)
  })
}

function* iterateEntityTypes(
  world: World,
): Generator<GroupGroup> {
  const entityByType: Partial<
    Record<EntityType, Entity[]>
  > = {}

  for (const entity of Object.values(world.entities)) {
    let array = entityByType[entity.type]
    if (!array) {
      array = entityByType[entity.type] = []
    }
    array.push(entity)
  }

  for (const entityType of Object.values(EntityType.enum)) {
    switch (entityType) {
      case EntityType.enum.StoneFurnace: {
        let totalBuilt = 0
        const groups: Record<
          FurnaceRecipeItemType,
          StoneFurnaceGroup
        > = {
          [FurnaceRecipeItemType.enum.StoneBrick]: {
            recipeItemType:
              FurnaceRecipeItemType.enum.StoneBrick,
            built: 0,
          },
          [FurnaceRecipeItemType.enum.IronPlate]: {
            recipeItemType:
              FurnaceRecipeItemType.enum.IronPlate,
            built: 0,
          },
          [FurnaceRecipeItemType.enum.CopperPlate]: {
            recipeItemType:
              FurnaceRecipeItemType.enum.CopperPlate,
            built: 0,
          },
        }
        for (const entity of entityByType[entityType] ??
          []) {
          invariant(
            entity.type === EntityType.enum.StoneFurnace,
          )
          groups[entity.recipeItemType].built += 1
          totalBuilt += 1
        }
        yield {
          type: EntityType.enum.StoneFurnace,
          groups: Object.values(groups),
          available: countInventory(
            world.inventory,
            entityType,
          ),
          totalBuilt,
        }
        break
      }
      case EntityType.enum.BurnerMiningDrill: {
        let totalBuilt = 0
        const groups: Record<
          ResourceType,
          BurnerMiningDrillGroup
        > = {
          [ResourceType.enum.Coal]: {
            resourceType: ResourceType.enum.Coal,
            built: 0,
          },
          [ResourceType.enum.Stone]: {
            resourceType: ResourceType.enum.Stone,
            built: 0,
          },
          [ResourceType.enum.IronOre]: {
            resourceType: ResourceType.enum.IronOre,
            built: 0,
          },
          [ResourceType.enum.CopperOre]: {
            resourceType: ResourceType.enum.CopperOre,
            built: 0,
          },
        }
        for (const entity of entityByType[entityType] ??
          []) {
          invariant(
            entity.type ===
              EntityType.enum.BurnerMiningDrill,
          )
          groups[entity.resourceType].built += 1
          totalBuilt += 1
        }

        yield {
          type: EntityType.enum.BurnerMiningDrill,
          groups: Object.values(groups),
          available: countInventory(
            world.inventory,
            entityType,
          ),
          totalBuilt,
        }
      }
    }
  }
}

function mapEntityTypes(
  world: World,
  cb: (args: GroupGroup, i: number) => JSX.Element,
) {
  const result: JSX.Element[] = []
  let i = 0
  for (const args of iterateEntityTypes(world)) {
    result.push(cb(args, i++))
  }
  return result
}

function formatItemPerSecond(
  count: number,
  window: number,
): string | null {
  if (count === 0) {
    return null
  }
  return `${((count / window) * TICKS_PER_SECOND).toFixed(1)}/s`
}

function formatSatisfaction(
  production: number,
  consumption: number,
): JSX.Element {
  if (consumption === 0) {
    return <>&infin;</>
  }
  const s = production / consumption
  return <>{`${(s * 100).toFixed()}%`}</>
}

function Stats() {
  const { world } = useContext(Context)

  const itemTypes = new Set<ItemType>()

  const production: Inventory = {}
  for (const sample of world.stats.production) {
    for (const [itemType, count] of iterateInventory(
      sample,
    )) {
      itemTypes.add(itemType)
      inventoryAdd(production, itemType, count)
    }
  }

  const consumption: Inventory = {}
  for (const sample of world.stats.consumption) {
    for (const [itemType, count] of iterateInventory(
      sample,
    )) {
      itemTypes.add(itemType)
      inventoryAdd(consumption, itemType, count)
    }
  }

  return (
    <div className={styles.stats}>
      <div />
      <FontAwesomeIcon
        icon={faArrowDownToBracket}
        className={styles['stats__header']}
      />
      <FontAwesomeIcon
        icon={faArrowUpFromBracket}
        className={styles['stats__header']}
      />
      <FontAwesomeIcon
        icon={faPercent}
        className={styles['stats__header']}
      />
      {[...itemTypes].map((itemType) => (
        <Fragment key={itemType}>
          <ItemLabel type={itemType} />
          <Text>
            {formatItemPerSecond(
              production[itemType] ?? 0,
              world.stats.window,
            )}
          </Text>
          <Text>
            {formatItemPerSecond(
              consumption[itemType] ?? 0,
              world.stats.window,
            )}
          </Text>
          <Text>
            {formatSatisfaction(
              production[itemType] ?? 0,
              consumption[itemType] ?? 0,
            )}
          </Text>
        </Fragment>
      ))}
    </div>
  )
}

export function WorldHome() {
  const {
    world,
    buildStoneFurnace,
    destroyStoneFurnace,
    buildBurnerMiningDrill,
    destroyBurnerMiningDrill,
  } = useContext(Context)

  return (
    <>
      <Heading3>Entities</Heading3>
      {mapEntityTypes(
        world,
        ({ type, groups, available }, i) => (
          <Fragment key={type}>
            {i !== 0 && <div className={styles.divider} />}
            <div className={styles['entity-type']}>
              <ItemLabel type={type} />
              <div
                className={styles['entity-type__available']}
              >
                {available}
                <FontAwesomeIcon icon={faWarehouse} />
              </div>
            </div>
            {(() => {
              switch (type) {
                case EntityType.enum.StoneFurnace: {
                  return (
                    <Fragment>
                      {groups.map(
                        ({ recipeItemType, built }) => (
                          <div
                            key={recipeItemType}
                            className={
                              styles['entity-details']
                            }
                          >
                            <ItemLabel
                              type={recipeItemType}
                            />
                            <ToggleEntityCount
                              onAdd={() => {
                                buildStoneFurnace(
                                  recipeItemType,
                                )
                              }}
                              onRemove={() => {
                                destroyStoneFurnace(
                                  recipeItemType,
                                )
                              }}
                              built={built}
                              available={available}
                            />
                          </div>
                        ),
                      )}
                    </Fragment>
                  )
                }
                case EntityType.enum.BurnerMiningDrill: {
                  return (
                    <Fragment>
                      {groups.map(
                        ({ resourceType, built }) => (
                          <div
                            key={resourceType}
                            className={
                              styles['entity-details']
                            }
                          >
                            <ItemLabel
                              type={resourceType}
                            />
                            <ToggleEntityCount
                              onAdd={() => {
                                buildBurnerMiningDrill(
                                  resourceType,
                                )
                              }}
                              onRemove={() => {
                                destroyBurnerMiningDrill(
                                  resourceType,
                                )
                              }}
                              built={built}
                              available={available}
                            />
                          </div>
                        ),
                      )}
                    </Fragment>
                  )
                }
                default: {
                  return null
                }
              }
            })()}
          </Fragment>
        ),
      )}

      <Heading3>Stats</Heading3>
      <Stats />

      <Heading3>Inventory</Heading3>
      <div className={styles['inventory-grid']}>
        {mapInventory(
          world.inventory,
          (itemType, count) => (
            <Fragment key={itemType}>
              <ItemLabel type={itemType} />
              <Text>{formatItemCount(count)}</Text>
            </Fragment>
          ),
        )}
      </div>
    </>
  )
}
