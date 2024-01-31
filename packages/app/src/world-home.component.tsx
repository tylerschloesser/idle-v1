import { Fragment, useContext } from 'react'
import invariant from 'tiny-invariant'
import { Button } from './button.component.js'
import { Context } from './context.js'
import { Heading3 } from './heading.component.js'
import { countInventory } from './inventory.js'
import { ItemLabel } from './item-label.component.js'
import { Select } from './select.component.js'
import { Text } from './text.component.js'
import { parseFurnaceRecipeItemType } from './util.js'
import styles from './world-home.module.scss'
import {
  Entity,
  EntityType,
  FurnaceRecipeItemType,
  Inventory,
  ItemType,
  World,
} from './world.js'

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
      <div
        className={styles['toggle-entity-count__available']}
      >
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

interface StoneFurnaceGroup {
  recipeItemType: FurnaceRecipeItemType
  built: number
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
        const groups: Partial<
          Record<FurnaceRecipeItemType, StoneFurnaceGroup>
        > = {}
        for (const entity of entityByType[entityType] ??
          []) {
          invariant(
            entity.type === EntityType.enum.StoneFurnace,
          )
          let group = groups[entity.recipeItemType]
          if (!group) {
            group = groups[entity.recipeItemType] = {
              recipeItemType: entity.recipeItemType,
              built: 0,
            }
          }
          group.built += 1
        }
        yield {
          type: EntityType.enum.StoneFurnace,
          groups: Object.values(groups),
          available: countInventory(
            world.inventory,
            entityType,
          ),
        }
        break
      }
    }
  }
}

interface StoneFurnaceGroupGroup {
  type: 'StoneFurnace'
  groups: StoneFurnaceGroup[]
  available: number
}

type GroupGroup = StoneFurnaceGroupGroup

function mapEntityTypes(
  world: World,
  cb: (args: GroupGroup) => JSX.Element,
) {
  const result: JSX.Element[] = []
  for (const args of iterateEntityTypes(world)) {
    result.push(cb(args))
  }
  return result
}

function NewStoneFurnace() {
  const { buildStoneFurnace } = useContext(Context)
  return (
    <>
      <Select<FurnaceRecipeItemType>
        placeholder="Choose Recipe"
        value={null}
        onChange={(recipeItemType) => {
          buildStoneFurnace(recipeItemType)
        }}
        options={Object.values(FurnaceRecipeItemType.enum)}
        parse={parseFurnaceRecipeItemType}
      />
    </>
  )
}

export function WorldHome() {
  const { world, buildStoneFurnace, destroyStoneFurnace } =
    useContext(Context)

  return (
    <>
      <div className={styles.power}>
        <Text>Power</Text>
        <Text>{world.power}</Text>
      </div>
      <Heading3>Entities</Heading3>
      {mapEntityTypes(
        world,
        ({ type, groups, available }) => (
          <Fragment key={type}>
            <div className={styles['entity-type']}>
              <ItemLabel type={type} /> (available:{' '}
              {available})
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
                      {available > 0 && <NewStoneFurnace />}
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

      <Heading3>Satisfaction</Heading3>
      <div className={styles['inventory-grid']}>
        {mapInventory(
          world.satisfaction.input,
          (itemType, s) => (
            <Fragment key={itemType}>
              <ItemLabel type={itemType} />
              <Text>{`${(s * 100).toFixed()}%`}</Text>
            </Fragment>
          ),
        )}
      </div>

      <Heading3>Inventory</Heading3>
      <div className={styles['inventory-grid']}>
        {mapInventory(
          world.inventory,
          (itemType, count) => (
            <Fragment key={itemType}>
              <ItemLabel type={itemType} />
              <Text>{count.toFixed(0)}</Text>
            </Fragment>
          ),
        )}
      </div>
    </>
  )
}
