import { faFire } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Fragment, useContext } from 'react'
import invariant from 'tiny-invariant'
import { Button } from './button.component.js'
import { Context } from './context.js'
import { Heading3 } from './heading.component.js'
import { canFulfillRecipe } from './inventory.js'
import { Text } from './text.component.js'
import styles from './world-build.module.scss'
import { EntityType, ItemType } from './world.js'

function BuildingIcon({ type }: { type: EntityType }) {
  switch (type) {
    case EntityType.enum.StoneFurnace:
      return <FontAwesomeIcon icon={faFire} />
  }
  return null
}

function BuildEntity({ type }: { type: EntityType }) {
  const { world, buildEntity } = useContext(Context)
  const recipe = world.entityRecipes[type]
  invariant(recipe)
  const disabled = !canFulfillRecipe(world, recipe)
  return (
    <>
      <div className={styles['building-name']}>
        <BuildingIcon type={type} />
        <Text>{type}</Text>
      </div>
      <div className={styles['building-details']}>
        <div className={styles.recipe}>
          {Object.entries(recipe.input).map(
            ([itemType, count]) => (
              <Fragment key={itemType}>
                <Text>{itemType}:</Text>
                <div>
                  <Text>
                    {world.inventory[
                      ItemType.parse(itemType)
                    ] ?? 0}{' '}
                  </Text>
                  <Text gray>/ {count}</Text>
                </div>
              </Fragment>
            ),
          )}
        </div>
        <Button
          disabled={disabled}
          onClick={() => {
            buildEntity(type)
          }}
        >
          Build
        </Button>
      </div>
    </>
  )
}

export function WorldBuild() {
  return (
    <>
      <Heading3>Buildings</Heading3>
      {Object.values(EntityType.enum).map((type) => (
        <BuildEntity key={type} type={type} />
      ))}
    </>
  )
}
