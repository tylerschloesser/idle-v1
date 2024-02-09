import { Fragment } from 'react'
import { ItemIcon } from '../icon.component.js'
import { Text } from '../text.component.js'
import { BufferEntity, ItemType, Recipe } from '../world.js'
import styles from './recipe-view.module.scss'

export interface RecipeViewProps {
  recipe: Recipe
  input: BufferEntity
}

function mapRecipeInput(
  recipe: Recipe,
  input: BufferEntity,
  cb: (
    itemType: ItemType,
    count: number,
    satisfaction: number | null,
  ) => JSX.Element,
): JSX.Element[] {
  const result: JSX.Element[] = []

  for (const [itemType, count] of Object.entries(
    recipe.input,
  )) {
    result.push(cb(ItemType.parse(itemType), count, null))
  }

  return result
}

export function RecipeView({
  recipe,
  input,
}: RecipeViewProps) {
  return (
    <div className={styles['recipe-view']}>
      {mapRecipeInput(recipe, input, (itemType, count) => (
        <Fragment key={itemType}>
          <ItemIcon type={itemType} />
          <Text>{count}</Text>
        </Fragment>
      ))}
    </div>
  )
}
