import { recipeBook } from './recipe-book.js'
import {
  getInputBuffer,
  getOutputBuffer,
} from './tick-util.js'
import { CombustionSmelterEntity, World } from './world.js'

/* eslint-disable @typescript-eslint/no-unused-vars */

export function tickCombustionSmelter(
  world: World,
  entity: CombustionSmelterEntity,
): void {
  const input = getInputBuffer(world, entity)
  const output = getOutputBuffer(world, entity)

  const recipe = recipeBook[entity.recipeItemType]

  let satisfaction = 1
}
