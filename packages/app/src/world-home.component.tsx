import { CSSProperties, Fragment, useContext } from 'react'
import invariant from 'tiny-invariant'
import { Context } from './context.js'
import styles from './world-home.module.scss'
import { WorldMap } from './world-map.component.js'
import { ItemType, StoneFurnaceEntity } from './world.js'

function EntityDetails({
  entity,
  index,
}: {
  entity: StoneFurnaceEntity
  index: number
}) {
  const { world, setStoneFurnaceRecipe } =
    useContext(Context)

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
      <div className={styles.label}>{entity.type}</div>
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
        <select
          className={styles.select}
          value={entity.recipeItemType ?? ''}
          onChange={(e) => {
            const itemType = ItemType.parse(e.target.value)
            setStoneFurnaceRecipe(index, itemType)
          }}
        >
          <option value="" disabled>
            Choose Recipe
          </option>
          {Object.keys(world.furnaceRecipes).map(
            (itemType) => (
              <option key={itemType} value={itemType}>
                {itemType}
              </option>
            ),
          )}
        </select>
        <input
          type="checkbox"
          className={styles.checkbox}
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
          <h2 className={styles.h2}>Entities</h2>
          <div className={styles.grid}>
            {entities.map((entity, i) => (
              <EntityDetails
                key={i}
                entity={entity}
                index={i}
              />
            ))}
          </div>
          <div className={styles.divider} />
        </>
      )}
      <h2 className={styles.h2}>Inventory</h2>
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
