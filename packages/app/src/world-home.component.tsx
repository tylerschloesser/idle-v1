import { useContext } from 'react'
import { Context } from './context.js'
import styles from './world-home.module.scss'
import { WorldMap } from './world-map.component.js'
import { Entity } from './world.js'

function EntityDetails({ entity }: { entity: Entity }) {
  const { world } = useContext(Context)
  return (
    <>
      <div className={styles.label}>{entity.type}</div>
      <select
        className={styles.input}
        value={entity.recipeItemType ?? ''}
      >
        <option
          value=""
          disabled
          selected={!entity.recipeItemType}
        >
          Choose Recipe
        </option>
        {Object.keys(world.furnaceRecipes).map(
          (itemType) => (
            <option
              key={itemType}
              value={itemType}
              selected={itemType === entity.recipeItemType}
            >
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
      <p className={styles.p}>ID: {world.id}</p>
      <div className={styles.grid}>
        {entities.map((entity, i) => (
          <EntityDetails key={i} entity={entity} />
        ))}
      </div>
    </>
  )
}
