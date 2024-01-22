import { CSSProperties, Fragment, useContext } from 'react'
import invariant from 'tiny-invariant'
import { Context } from './context.js'
import { Heading3 } from './heading.component.js'
import { Select } from './select.component.js'
import { Text } from './text.component.js'
import styles from './world-home.module.scss'
import { WorldMap } from './world-map.component.js'
import {
  BurnerMiningDrillEntity,
  EntityType,
  ItemType,
  ResourceType,
  StoneFurnaceEntity,
} from './world.js'

function parseItemType(data: unknown): ItemType {
  return ItemType.parse(data)
}

function parseResourceType(data: unknown): ResourceType {
  return ResourceType.parse(data)
}

function BurnerMiningDrillDetails({
  entity,
}: {
  entity: BurnerMiningDrillEntity
}) {
  return (
    <>
      <Text>{entity.type}</Text>
      <div></div>
      <Select<ItemType>
        placeholder="Choose Resource"
        value={entity.resourceType}
        onChange={() => {
          console.log('todo')
        }}
        options={Object.values(ResourceType.Values)}
        parse={parseResourceType}
      />
      <label className={styles.enabled}>
        <Text invert bold>
          Enabled
        </Text>
        <input
          type="checkbox"
          className={styles.checkbox}
          checked={entity.enabled}
          onChange={() => {
            console.log('todo')
          }}
        />
      </label>
    </>
  )
}

function StoneFurnaceDetails({
  entity,
}: {
  entity: StoneFurnaceEntity
}) {
  const {
    world,
    setStoneFurnaceRecipe,
    setStoneFurnaceEnabled,
  } = useContext(Context)

  let craftProgress = 0
  const recipe = entity.recipeItemType
    ? world.furnaceRecipes[entity.recipeItemType]
    : null
  invariant(recipe !== undefined)
  if (recipe && entity.craftTicksRemaining) {
    craftProgress =
      (recipe.ticks - entity.craftTicksRemaining) /
      recipe.ticks
  }

  const fuelProgress = entity.fuelTicksRemaining / 50
  invariant(fuelProgress >= 0 && fuelProgress <= 1)

  return (
    <>
      <Text>{entity.type}</Text>
      <div
        className={styles['furnace-progress']}
        style={
          {
            '--craft-progress': `${craftProgress}`,
            '--fuel-progress': `${fuelProgress}`,
          } as CSSProperties
        }
      >
        <div className={styles['furnace-progress-fuel']} />
        <div className={styles['furnace-progress-craft']} />
      </div>
      <Select<ItemType>
        placeholder="Choose Recipe"
        value={entity.recipeItemType}
        onChange={(itemType) => {
          setStoneFurnaceRecipe(entity.id, itemType)
        }}
        options={Object.keys(world.furnaceRecipes).map(
          parseItemType,
        )}
        parse={parseItemType}
      />
      <label className={styles.enabled}>
        <Text>Enabled</Text>
        <input
          type="checkbox"
          className={styles.checkbox}
          checked={entity.enabled}
          onChange={(e) => {
            setStoneFurnaceEnabled(
              entity.id,
              e.target.checked,
            )
          }}
        />
      </label>
    </>
  )
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
        {Object.entries(world.inventory).map(
          ([itemType, count]) => (
            <Fragment key={itemType}>
              <Text>{itemType}</Text>
              <Text>{count}</Text>
            </Fragment>
          ),
        )}
      </div>
    </>
  )
}
