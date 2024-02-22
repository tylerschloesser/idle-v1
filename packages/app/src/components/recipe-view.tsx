import { Fragment } from 'react'
import { ItemIcon } from '../icon.component.js'
import { Text, TextProps } from '../text.component.js'
import { Block, ItemType, Recipe } from '../world.js'
import styles from './recipe-view.module.scss'

export interface RecipeViewProps {
  recipe: Recipe
  block: Block
}

function mapRecipeInput(
  recipe: Recipe,
  block: Block,
  cb: (
    itemType: ItemType,
    count: number,
    satisfaction: number | null,
  ) => JSX.Element,
): JSX.Element[] {
  const result: JSX.Element[] = []

  for (const [key, count] of Object.entries(recipe.input)) {
    const itemType = ItemType.parse(key)
    const satisfaction =
      (block.items[itemType]?.count ?? 0) / count
    result.push(cb(itemType, count, satisfaction))
  }

  return result
}

export function RecipeView({
  recipe,
  block,
}: RecipeViewProps) {
  return (
    <div className={styles['recipe-view']}>
      {mapRecipeInput(
        recipe,
        block,
        (itemType, count, satisfaction) => {
          let color: TextProps['color'] = undefined
          if (satisfaction !== null) {
            if (satisfaction >= 1) {
              color = 'green100'
            } else if (satisfaction > 0.5) {
              color = 'yellow100'
            } else {
              color = 'red100'
            }
          }
          return (
            <Fragment key={itemType}>
              <ItemIcon type={itemType} />
              <Text color={color}>{count}</Text>
            </Fragment>
          )
        },
      )}
    </div>
  )
}
