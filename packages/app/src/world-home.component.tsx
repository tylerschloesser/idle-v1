import { CSSProperties, Fragment, useContext } from 'react'
import invariant from 'tiny-invariant'
import { Context } from './context.js'
import { Heading3 } from './heading.component.js'
import { Select } from './select.component.js'
import { Text } from './text.component.js'
import styles from './world-home.module.scss'
import { WorldMap } from './world-map.component.js'
import {
  AssemblerEntity,
  AssemblerRecipeItemType,
  BurnerMiningDrillEntity,
  COAL_FUEL_TICKS,
  EntityType,
  FurnaceRecipeItemType,
  GeneratorEntity,
  ItemType,
  MINE_TICKS,
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

function EnabledCheckbox({
  checked,
  onChange,
}: {
  checked: boolean
  onChange(checked: boolean): void
}) {
  return (
    <label className={styles.enabled}>
      <Text invert bold>
        Enabled
      </Text>
      <input
        type="checkbox"
        className={styles.checkbox}
        checked={checked}
        onChange={(e) => {
          onChange(e.target.checked)
        }}
      />
    </label>
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

  let mineProgress = 0
  if (entity.mineTicksRemaining !== null) {
    mineProgress =
      1 - entity.mineTicksRemaining / MINE_TICKS
  }

  const fuelProgress =
    entity.fuelTicksRemaining / COAL_FUEL_TICKS
  invariant(fuelProgress >= 0 && fuelProgress <= 1)

  return (
    <>
      <Text>{entity.type}</Text>
      <ProgressBar
        entityProgress={mineProgress}
        fuelProgress={fuelProgress}
      />
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
      <EnabledCheckbox
        checked={entity.enabled}
        onChange={(enabled) => {
          setEntityEnabled(entity.id, enabled)
        }}
      />
    </>
  )
}

function ProgressBar({
  entityProgress,
  fuelProgress,
}: {
  entityProgress: number
  fuelProgress: number
}) {
  return (
    <div
      className={styles['progress-bar']}
      style={
        {
          '--entity-progress': `${entityProgress}`,
          '--fuel-progress': `${fuelProgress}`,
        } as CSSProperties
      }
    >
      <div className={styles['fuel-progress']} />
      <div className={styles['entity-progress']} />
    </div>
  )
}

function StoneFurnaceDetails({
  entity,
}: {
  entity: StoneFurnaceEntity
}) {
  const { world, setStoneFurnaceRecipe, setEntityEnabled } =
    useContext(Context)

  let craftProgress = 0
  const recipe = entity.recipeItemType
    ? world.furnaceRecipes[entity.recipeItemType]
    : null
  invariant(recipe !== undefined)
  if (recipe && entity.craftTicksRemaining !== null) {
    craftProgress =
      (recipe.ticks - entity.craftTicksRemaining) /
      recipe.ticks
  }

  const fuelProgress =
    entity.fuelTicksRemaining / COAL_FUEL_TICKS
  invariant(fuelProgress >= 0 && fuelProgress <= 1)

  return (
    <>
      <Text>{entity.type}</Text>
      <ProgressBar
        entityProgress={craftProgress}
        fuelProgress={fuelProgress}
      />
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
      <div></div>
      <EnabledCheckbox
        checked={entity.enabled}
        onChange={(enabled) => {
          setEntityEnabled(entity.id, enabled)
        }}
      />
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
      <EnabledCheckbox
        checked={entity.enabled}
        onChange={(enabled) => {
          setEntityEnabled(entity.id, enabled)
        }}
      />
    </>
  )
}

function mapInventory(
  world: World,
  cb: (
    itemType: ItemType,
    count: number,
    limit: number,
    production: number,
    consumption: number,
  ) => JSX.Element,
): JSX.Element[] {
  return Object.entries(world.inventory).map((entry) => {
    const itemType = ItemType.parse(entry[0])
    const count = entry[1]
    const limit = world.inventoryLimits[itemType]
    let production = 0
    let consumption = 0
    for (const stat of world.stats.window) {
      production += stat.production[itemType] ?? 0
      consumption += stat.consumption[itemType] ?? 0
    }
    return cb(
      itemType,
      count,
      limit,
      production,
      consumption,
    )
  })
}

export function WorldHome() {
  const { world } = useContext(Context)

  const entities = Object.values(world.entities).flat()

  return (
    <>
      <WorldMap />

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
        {mapInventory(
          world,
          (
            itemType,
            count,
            limit,
            production,
            consumption,
          ) => (
            <Fragment key={itemType}>
              <Text>{itemType}</Text>
              <span>
                <Text>{count}</Text>{' '}
                <Text gray>/ {limit}</Text>
              </span>
              <Text>+{production}/s</Text>
              <Text>-{consumption}/s</Text>
            </Fragment>
          ),
        )}
      </div>
    </>
  )
}
