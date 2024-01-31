import { Fragment, useContext } from 'react'
import invariant from 'tiny-invariant'
import { Button } from './button.component.js'
import { Context } from './context.js'
import { Heading3 } from './heading.component.js'
import { canFulfillRecipe } from './inventory.js'
import { ItemLabel } from './item-label.component.js'
import { Text } from './text.component.js'
import styles from './world-build.module.scss'
import { EntityType, ItemType } from './world.js'

function BuildEntity({ type }: { type: EntityType }) {
  const { world, craftEntity: buildEntity } =
    useContext(Context)
  const recipe = world.entityRecipes[type]
  invariant(recipe)
  const disabled = !canFulfillRecipe(world, recipe)
  return (
    <>
      <div className={styles.entity}>
        <ItemLabel type={type} />
        <div className={styles['building-details']}>
          <Button
            disabled={disabled}
            onClick={() => {
              buildEntity(type)
            }}
          >
            Build
          </Button>
        </div>
      </div>
      <div className={styles.recipe}>
        {Object.entries(recipe.input).map(
          ([itemType, count]) => (
            <Fragment key={itemType}>
              <ItemLabel type={ItemType.parse(itemType)} />
              <div>
                <Text>
                  {(
                    world.inventory[
                      ItemType.parse(itemType)
                    ] ?? 0
                  ).toFixed()}{' '}
                </Text>
                <Text gray>/ {count.toFixed()}</Text>
              </div>
            </Fragment>
          ),
        )}
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
