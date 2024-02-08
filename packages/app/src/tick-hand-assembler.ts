import { recipeBook } from './recipe-book.js'
import { HandAssemblerEntity, World } from './world.js'

export function tickHandAssembler(
  world: World,
  entity: HandAssemblerEntity,
): void {
  const head = entity.queue.at(0)
  if (!head) return

  const recipe = recipeBook[head.recipeItemType]
}
