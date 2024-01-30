import { Fragment, useContext } from 'react'
import { NavLink } from 'react-router-dom'
import invariant from 'tiny-invariant'
import { Checkbox } from './checkbox.component.js'
import { Context } from './context.js'
import { Heading3 } from './heading.component.js'
import { ItemLabel } from './item-label.component.js'
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
    <div className={styles['entity-details']}>
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
    </div>
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
    <div className={styles['entity-details']}>
      <div></div>
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
      <EnabledCheckbox
        checked={entity.enabled}
        onChange={(enabled) => {
          setEntityEnabled(entity.id, enabled)
        }}
      />
      <EditLink entity={entity} />
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
  world: World,
  cb: (itemType: ItemType, count: number) => JSX.Element,
): JSX.Element[] {
  return Object.entries(world.inventory).map((entry) => {
    const itemType = ItemType.parse(entry[0])
    const count = entry[1]
    return cb(itemType, count)
  })
}

function groupEntities(
  entities: World['entities'],
): Record<EntityType, Entity[]> {
  const grouped: Record<EntityType, Entity[]> = {
    [EntityType.enum.StoneFurnace]: [],
    [EntityType.enum.BurnerMiningDrill]: [],
    [EntityType.enum.Assembler]: [],
    [EntityType.enum.Lab]: [],
    [EntityType.enum.Generator]: [],
  }

  for (const entity of Object.values(entities)) {
    grouped[entity.type].push(entity)
  }

  return grouped
}

function mapEntityGroups(
  groups: ReturnType<typeof groupEntities>,
  cb: (
    entityType: EntityType,
    entities: Entity[],
  ) => JSX.Element,
) {
  const result: JSX.Element[] = []
  for (const [entityType, entities] of Object.entries(
    groups,
  )) {
    if (entities.length === 0) {
      continue
    }

    const parsed = EntityType.parse(entityType)
    invariant(
      entities.every((entity) => entity.type === parsed),
    )

    result.push(cb(parsed, entities))
  }
  return result
}

export function WorldHome() {
  const { world } = useContext(Context)

  const groups = groupEntities(world.entities)

  return (
    <>
      <Heading3>Entities</Heading3>
      <div className={styles.power}>
        <Text>Power</Text>
        <Text>{world.power}</Text>
      </div>
      {mapEntityGroups(groups, (entityType, entities) => (
        <Fragment key={entityType}>
          <div className={styles['entity-type']}>
            <ItemLabel type={entityType} />
          </div>
          {entities.map((entity) => (
            <Fragment key={entity.id}>
              {(() => {
                switch (entity.type) {
                  case EntityType.enum.StoneFurnace:
                    return (
                      <StoneFurnaceDetails
                        entity={entity}
                      />
                    )
                  case EntityType.enum.BurnerMiningDrill:
                    return (
                      <BurnerMiningDrillDetails
                        entity={entity}
                      />
                    )
                  case EntityType.enum.Assembler:
                    return (
                      <AssemblerDetails entity={entity} />
                    )
                  case EntityType.enum.Lab:
                    return <LabDetails entity={entity} />
                  case EntityType.enum.Generator:
                    return (
                      <GeneratorDetails entity={entity} />
                    )
                }
              })()}
            </Fragment>
          ))}
        </Fragment>
      ))}

      <Heading3>Inventory</Heading3>
      <div className={styles['inventory-grid']}>
        {mapInventory(world, (itemType, count) => (
          <Fragment key={itemType}>
            <Text>{itemType}</Text>
            <Text>{count.toFixed(0)}</Text>
          </Fragment>
        ))}
      </div>
    </>
  )
}
