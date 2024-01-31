import { Fragment, useContext } from 'react'
import { NavLink } from 'react-router-dom'
import * as z from 'zod'
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
  current: number
  available: number
}

function ToggleEntityCount({
  current,
  available,
}: ToggleEntityCountProps) {
  return <>TODO toggle entity count</>
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
      <ToggleEntityCount current={0} available={0} />
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

const StoneFurnaceGroup = z.strictObject({
  type: z.literal(EntityType.enum.StoneFurnace),
  recipeItemType: FurnaceRecipeItemType,
  count: z.number(),
  available: z.number(),
})
type StoneFurnaceGroup = z.infer<typeof StoneFurnaceGroup>

function mapStoneFurnaceGroup(
  group: StoneFurnaceGroup,
  cb: (
    recipeItemType: FurnaceRecipeItemType,
    count: number,
  ) => void,
) {}

function* iterateGroups(
  world: World,
  groups: ReturnType<typeof groupEntities>,
) {
  for (const [key, value] of Object.entries(groups)) {
    const entityType = EntityType.parse(key)
    const available = countInventory(
      world.inventory,
      entityType,
    )
    switch (entityType) {
      case EntityType.enum.StoneFurnace: {
        for (const [
          recipeItemType,
          count,
        ] of Object.entries(value)) {
          const group: StoneFurnaceGroup = {
            type: EntityType.enum.StoneFurnace,
            available,
            count,
            recipeItemType:
              FurnaceRecipeItemType.parse(recipeItemType),
          }
          yield group
        }
      }
    }
  }
}

type Group = StoneFurnaceGroup

function mapEntityGroups(
  world: World,
  cb: (group: Group) => JSX.Element,
) {
  const groups = groupEntities(world.entities)

  const result: JSX.Element[] = []

  for (const group of iterateGroups(world, groups)) {
    result.push(cb(group))
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
  const { world } = useContext(Context)

  return (
    <>
      <div className={styles.power}>
        <Text>Power</Text>
        <Text>{world.power}</Text>
      </div>
      <Heading3>Entities</Heading3>
      {mapEntityGroups(world, (group) => (
        <Fragment key={group.type}>
          <div className={styles['entity-type']}>
            <ItemLabel type={group.type} />
          </div>
          {(() => {
            switch (group.type) {
              case EntityType.enum.StoneFurnace: {
                return <>TODO</>
              }
              default: {
                return null
              }
            }
          })()}
        </Fragment>
      ))}

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
