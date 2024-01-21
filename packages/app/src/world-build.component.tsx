import { useContext } from 'react'
import invariant from 'tiny-invariant'
import { Context } from './context.js'
import styles from './world-build.module.scss'
import { WorldMap } from './world-map.component.js'
import { EntityType, ItemType } from './world.js'

function BuildEntity({ type }: { type: EntityType }) {
  const { world, buildEntity } = useContext(Context)
  const recipe = world.entityRecipes[type]
  invariant(recipe)
  let disabled = false
  for (const entry of Object.entries(recipe)) {
    if (
      (world.inventory[entry[0] as ItemType] ?? 0) <
      entry[1]
    ) {
      disabled = true
      break
    }
  }
  return (
    <>
      <div className={styles.label}>{type}</div>
      <button
        className={styles['build-button']}
        disabled={disabled}
        onClick={() => {
          buildEntity(type)
        }}
      >
        Build
      </button>
    </>
  )
}

export function WorldBuild() {
  return (
    <>
      <WorldMap />
      <div className={styles.grid}>
        {Object.values(EntityType.enum).map((type) => (
          <BuildEntity key={type} type={type} />
        ))}
      </div>
    </>
  )
}
