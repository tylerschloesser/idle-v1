import { Fragment, useContext } from 'react'
import { NavLink } from 'react-router-dom'
import invariant from 'tiny-invariant'
import { Checkbox } from './checkbox.component.js'
import { Context } from './context.js'
import { Heading3 } from './heading.component.js'
import { Select } from './select.component.js'
import { Text } from './text.component.js'
import styles from './world-home.module.scss'
import {
  AssemblerEntity,
  AssemblerRecipeItemType,
  BurnerMiningDrillEntity,
  Entity,
  EntityType,
  FurnaceRecipeItemType,
  GeneratorEntity,
  ItemType,
  LabEntity,
  ResourceType,
  StoneFurnaceEntity,
  World,
} from './world.js'

function parseResourceType(data: unknown): ResourceType {
  return ResourceType.parse(data)
}

function parseFurnaceRecipeItemType(
  data: unknown,
): FurnaceRecipeItemType {
  return FurnaceRecipeItemType.parse(data)
}

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
  const {
    setBurnerMiningDrillResourceType,
    setEntityEnabled,
  } = useContext(Context)

  return (
    <>
      <Text>{entity.type}</Text>
      {entity.resourceType === null ? (
        <Select<ResourceType>
          placeholder="Choose Resource"
          value={entity.resourceType}
          onChange={(resourceType) => {
            setBurnerMiningDrillResourceType(
              entity.id,
              resourceType,
            )
          }}
          options={Object.values(ResourceType.enum)}
          parse={parseResourceType}
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

function StoneFurnaceDetails({
  entity,
}: {
  entity: StoneFurnaceEntity
}) {
  const { setStoneFurnaceRecipe, setEntityEnabled } =
    useContext(Context)
  return (
    <>
      <Text>{entity.type}</Text>
      {entity.recipeItemType === null ? (
        <Select<FurnaceRecipeItemType>
          placeholder="Choose Recipe"
          value={entity.recipeItemType}
          onChange={(itemType) => {
            setStoneFurnaceRecipe(entity.id, itemType)
          }}
          options={Object.values(
            FurnaceRecipeItemType.enum,
          ).map(parseFurnaceRecipeItemType)}
          parse={parseFurnaceRecipeItemType}
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

function GeneratorDetails({
  entity,
}: {
  entity: GeneratorEntity
}) {
  const { setEntityEnabled } = useContext(Context)
  return (
    <>
      <Text>{entity.type}</Text>
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
      <Text>{entity.type}</Text>
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
      <Text>{entity.type}</Text>
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
  world: World,
  cb: (itemType: ItemType, count: number) => JSX.Element,
): JSX.Element[] {
  return Object.entries(world.inventory).map((entry) => {
    const itemType = ItemType.parse(entry[0])
    const count = entry[1]
    return cb(itemType, count)
  })
}

export function WorldHome() {
  const { world } = useContext(Context)

  const entities = Object.values(world.entities).flat()

  return (
    <>
      {entities.length > 0 && (
        <>
          <Heading3>Entities</Heading3>
          <div className={styles.power}>
            <Text>Power</Text>
            <Text>{world.power}</Text>
          </div>
          <div className={styles.grid}>
            {entities.map((entity) => {
              switch (entity.type) {
                case EntityType.enum.StoneFurnace:
                  return (
                    <StoneFurnaceDetails
                      key={entity.id}
                      entity={entity}
                    />
                  )
                case EntityType.enum.BurnerMiningDrill:
                  return (
                    <BurnerMiningDrillDetails
                      key={entity.id}
                      entity={entity}
                    />
                  )
                case EntityType.enum.Generator:
                  return (
                    <GeneratorDetails
                      key={entity.id}
                      entity={entity}
                    />
                  )
                case EntityType.enum.Assembler:
                  return (
                    <AssemblerDetails
                      key={entity.id}
                      entity={entity}
                    />
                  )
                case EntityType.enum.Lab:
                  return (
                    <LabDetails
                      key={entity.id}
                      entity={entity}
                    />
                  )
                default:
                  invariant(false)
              }
            })}
          </div>
          <div className={styles.divider} />
        </>
      )}

      <Heading3>Inventory</Heading3>
      <div className={styles['inventory-grid']}>
        {mapInventory(world, (itemType, count) => (
          <Fragment key={itemType}>
            <Text>{itemType}</Text>
            <span>
              <Text>{count}</Text>
            </span>
            <Text></Text>
            <Text></Text>
          </Fragment>
        ))}
      </div>
    </>
  )
}
