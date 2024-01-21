import { useContext } from 'react'
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
  return (
    <>
      <div className={styles.label}>{entity.type}</div>
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
    </>
  )
}

export function WorldHome() {
  const { world } = useContext(Context)

  const entities = Object.values(world.entities).flat()

  return (
    <>
      <WorldMap />

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
  )
}
