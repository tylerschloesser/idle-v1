import { Fragment, useContext } from 'react'
import { NavLink } from 'react-router-dom'
import invariant from 'tiny-invariant'
import { Button } from './button.component.js'
import { Checkbox } from './checkbox.component.js'
import { Context } from './context.js'
import { Heading3 } from './heading.component.js'
import { countInventory } from './inventory.js'
import { ItemLabel } from './item-label.component.js'
import { Select } from './select.component.js'
import { Text } from './text.component.js'
import { parseFurnaceRecipeItemType } from './util.js'
import styles from './world-home.module.scss'
import {
  AssemblerEntity,
  AssemblerRecipeItemType,
  BurnerMiningDrillEntity,
  Entity,
  EntityType,
  FurnaceRecipeItemType,
  GeneratorEntity,
  Inventory,
  ItemType,
  LabEntity,
  StoneFurnaceEntity,
  World,
} from './world.js'

function parseAssemblerRecipeItemType(
  data: unknown,
): AssemblerRecipeItemType {
  return AssemblerRecipeItemType.parse(data)
}

function EditLink({ entity }: { entity: Entity }) {
  return (
    <NavLink
      to={`../entity/${entity.id}`}
      className={styles['edit-link']}
    >
      Edit
    </NavLink>
  )
}

function EnabledCheckbox({
  checked,
  onChange,
}: {
  checked: boolean
  onChange(checked: boolean): void
}) {
  return (
    <Checkbox checked={checked} onChange={onChange}>
      Enabled
    </Checkbox>
  )
}

function BurnerMiningDrillDetails({
  entity,
}: {
  entity: BurnerMiningDrillEntity
}) {
  return (
    <div className={styles['entity-details']}>
      {entity.resourceType ? (
        <ItemLabel type={entity.resourceType} />
      ) : (
        <div />
      )}
      <EditLink entity={entity} />
    </div>
  )
}

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

function StoneFurnaceDetails({
  entity,
}: {
  entity: StoneFurnaceEntity
}) {
  return (
    <div className={styles['entity-details']}>
      {entity.recipeItemType ? (
        <ItemLabel type={entity.recipeItemType} />
      ) : (
        <div />
      )}
    </div>
  )
}

function GeneratorDetails({
  entity,
}: {
  entity: GeneratorEntity
}) {
  const { setEntityEnabled } = useContext(Context)
  return (
    <>
      <div></div>
      <EnabledCheckbox
        checked={entity.enabled}
        onChange={(enabled) => {
          setEntityEnabled(entity.id, enabled)
        }}
      />
      <EditLink entity={entity} />
    </>
  )
}

function AssemblerDetails({
  entity,
}: {
  entity: AssemblerEntity
}) {
  const { setEntityEnabled, setAssemblerRecipe } =
    useContext(Context)
  return (
    <>
      <div></div>
      {entity.recipeItemType === null ? (
        <Select<AssemblerRecipeItemType>
          placeholder="Choose Recipe"
          value={entity.recipeItemType}
          onChange={(itemType) => {
            setAssemblerRecipe(entity.id, itemType)
          }}
          options={Object.values(
            AssemblerRecipeItemType.enum,
          ).map(parseAssemblerRecipeItemType)}
          parse={parseAssemblerRecipeItemType}
        />
      ) : (
        <EnabledCheckbox
          checked={entity.enabled}
          onChange={(enabled) => {
            setEntityEnabled(entity.id, enabled)
          }}
        />
      )}
      <EditLink entity={entity} />
    </>
  )
}

function LabDetails({ entity }: { entity: LabEntity }) {
  const { setEntityEnabled } = useContext(Context)
  return (
    <>
      <div></div>
      <EnabledCheckbox
        checked={entity.enabled}
        onChange={(enabled) => {
          setEntityEnabled(entity.id, enabled)
        }}
      />
      <EditLink entity={entity} />
    </>
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

function groupEntities(entities: World['entities']) {
  const groups: {
    [EntityType.enum.StoneFurnace]: Record<
      FurnaceRecipeItemType,
      number
    >
  } = {
    [EntityType.enum.StoneFurnace]: {
      [FurnaceRecipeItemType.enum.StoneBrick]: 0,
      [FurnaceRecipeItemType.enum.IronPlate]: 0,
      [FurnaceRecipeItemType.enum.CopperPlate]: 0,
    },
  }

  for (const entity of Object.values(entities)) {
    switch (entity.type) {
      case EntityType.enum.StoneFurnace: {
        // prettier-ignore
        groups[EntityType.enum.StoneFurnace][entity.recipeItemType] += 1
        break
      }
    }
  }

  return groups
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
