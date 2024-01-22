import { CSSProperties, Fragment, useContext } from 'react'
import invariant from 'tiny-invariant'
import { Context } from './context.js'
import { Select } from './select.component.js'
import styles from './world-home.module.scss'
import { WorldMap } from './world-map.component.js'
import { ItemType, StoneFurnaceEntity } from './world.js'

function parseItemType(data: unknown): ItemType {
  return ItemType.parse(data)
}

function StoneFurnaceDetails({
  entity,
  index,
}: {
  entity: StoneFurnaceEntity
  index: number
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
      <div
        className={styles.label}
      >{`${entity.type}#${index + 1}`}</div>
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
      <div className={styles['furnace-controls']}>
        <Select<ItemType>
          placeholder="Choose Recipe"
          value={entity.recipeItemType}
          onChange={(itemType) => {
            setStoneFurnaceRecipe(index, itemType)
          }}
          options={Object.keys(world.furnaceRecipes).map(
            parseItemType,
          )}
          parse={parseItemType}
        />
        <input
          type="checkbox"
          className={styles.checkbox}
          checked={entity.enabled}
          onChange={(e) => {
            setStoneFurnaceEnabled(index, e.target.checked)
          }}
        />
      </div>
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
          <h3 className={styles.h3}>Entities</h3>
          <div className={styles.grid}>
            {entities.map((entity, i) => (
              <StoneFurnaceDetails
                key={i}
                entity={entity}
                index={i}
              />
            ))}
          </div>
          <div className={styles.divider} />
        </>
      )}
      <h3 className={styles.h3}>Inventory</h3>
      <div className={styles['inventory-grid']}>
        {Object.entries(world.inventory).map(
          ([itemType, count]) => (
            <Fragment key={itemType}>
              <div>{itemType}</div>
              <div>{count}</div>
            </Fragment>
          ),
        )}
      </div>
    </>
  )
}
