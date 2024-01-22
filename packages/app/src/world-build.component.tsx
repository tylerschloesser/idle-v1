import { useContext } from 'react'
import invariant from 'tiny-invariant'
import { Button } from './button.component.js'
import { Context } from './context.js'
import { Heading3 } from './heading.component.js'
import { Text } from './text.component.js'
import styles from './world-build.module.scss'
import { WorldMap } from './world-map.component.js'
import { EntityType, ItemType } from './world.js'

function BuildEntity({ type }: { type: EntityType }) {
  const { world, buildEntity } = useContext(Context)
  const recipe = world.entityRecipes[type]
  invariant(recipe)
  let disabled = false
  for (const entry of Object.entries(recipe.input)) {
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
      <Text>{type}</Text>
      <div></div>
      <Button
        disabled={disabled}
        onClick={() => {
          buildEntity(type)
        }}
      >
        Build
      </Button>
    </>
  )
}

export function WorldBuild() {
  return (
    <>
      <WorldMap />
      <Heading3>Buildings</Heading3>
      <div className={styles.grid}>
        {Object.values(EntityType.enum).map((type) => (
          <BuildEntity key={type} type={type} />
        ))}
      </div>
    </>
  )
}
