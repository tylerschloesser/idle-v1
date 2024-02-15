import invariant from 'tiny-invariant'
import { recipeBook } from './recipe-book.js'
import {
  getInputBuffer,
  getOutputBuffer,
  iterateRecipeInput,
  iterateRecipeOutput,
} from './tick-util.js'
import {
  BufferEntity,
  HandAssemblerEntity,
  ItemType,
  World,
} from './world.js'

function getSatisfaction(
  itemType: ItemType,
  count: number,
  input: BufferEntity,
): number {
  invariant(count > 0)
  return (input.contents[itemType]?.count ?? 0) / count
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

  const targetTicks = head.count * recipe.ticks
  invariant(head.ticks < targetTicks)

  const ticksRemaining = targetTicks - head.ticks

  let satisfaction = Math.min(1, ticksRemaining)

  const input = getInputBuffer(world, entity)
  const output = getOutputBuffer(world, entity)

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

  for (const [itemType, count] of iterateRecipeInput(
    recipe,
    satisfaction,
  )) {
    invariant(input.contents[itemType]!.count >= count)
    input.contents[itemType]!.count -= count
  }

  for (const [itemType, count] of iterateRecipeOutput(
    recipe,
    satisfaction,
  )) {
    let value = output.contents[itemType]
    if (!value) {
      value = output.contents[itemType] = {
        condition: 1,
        count: 0,
      }
    }
    value.count += count
  }

  head.ticks += satisfaction
  if (head.ticks >= targetTicks) {
    entity.queue.shift()
  }
}
