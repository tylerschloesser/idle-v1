import invariant from 'tiny-invariant'
import { recipeBook } from './recipe-book.js'
import {
  consume,
  getInputBuffer,
  getOutputBuffer,
  iterateCombustionSmelterRecipeInput,
  iterateRecipeOutput,
  produce,
} from './tick-util.js'
import { CombustionSmelterEntity, World } from './world.js'

export function tickCombustionSmelter(
  world: World,
  entity: CombustionSmelterEntity,
): void {
  const { scale } = entity
  const input = getInputBuffer(world, entity)
  const output = getOutputBuffer(world, entity)

  const recipe = recipeBook[entity.recipeItemType]

  let satisfaction: number = 1
  for (const [
    itemType,
    count,
  ] of iterateCombustionSmelterRecipeInput({
    entity,
    recipe,
    scale,
  })) {
    satisfaction = Math.min(
      satisfaction,
      (input.contents[itemType]?.count ?? 0) / count,
    )
  }

  invariant(satisfaction >= 0)
  if (satisfaction === 0) {
    return
  }

  for (const [
    itemType,
    count,
  ] of iterateCombustionSmelterRecipeInput({
    entity,
    recipe,
    satisfaction,
    scale,
  })) {
    consume({ input, itemType, count })
  }

  for (const [itemType, count] of iterateRecipeOutput({
    recipe,
    satisfaction,
  })) {
    produce({ output, itemType, count })
  }
}
