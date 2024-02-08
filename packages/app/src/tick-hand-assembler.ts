import { InputHTMLAttributes } from 'react'
import invariant from 'tiny-invariant'
import { recipeBook } from './recipe-book.js'
import {
  AssemblerRecipe,
  BufferEntity,
  EntityType,
  HandAssemblerEntity,
  ItemType,
  World,
} from './world.js'

function* iterateRecipeInput(
  recipe: AssemblerRecipe,
): Generator<[ItemType, number]> {
  for (const [itemType, count] of Object.entries(
    recipe.input,
  )) {
    yield [ItemType.parse(itemType), count / recipe.ticks]
  }
}

function getSatisfaction(
  itemType: ItemType,
  count: number,
  input: BufferEntity,
): number {
  invariant(count > 0)
  return (input.contents[itemType]?.count ?? 0) / count
}

function getInputBuffer(
  world: World,
  entity: HandAssemblerEntity,
): BufferEntity {
  const entityIds = Object.keys(entity.input)
  invariant(entityIds.length === 1)
  const entityId = entityIds.at(0)!
  const buffer = world.entities[entityId]
  invariant(buffer?.type === EntityType.enum.Buffer)
  return buffer
}

export function tickHandAssembler(
  world: World,
  entity: HandAssemblerEntity,
): void {
  const head = entity.queue.at(0)
  if (!head) {
    return
  }

  const recipe = recipeBook[head.recipeItemType]

  let satisfaction = 1
  const input = getInputBuffer(world, entity)

  for (const [itemType, count] of iterateRecipeInput(
    recipe,
  )) {
    satisfaction = Math.min(
      satisfaction,
      getSatisfaction(itemType, count, input),
    )
  }

  invariant(satisfaction >= 0)
  if (satisfaction === 0) {
    return
  }
}
