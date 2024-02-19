import invariant from 'tiny-invariant'
import { recipeBook } from './recipe-book.js'
import {
  EntityPreTickResult,
  EntityTickResult,
  iterateRecipeInput,
  iterateRecipeOutput,
} from './tick-util.js'
import { gte } from './util.js'
import { HandAssemblerEntity, World } from './world.js'

function getTickContext(
  head: HandAssemblerEntity['queue'][0],
  scale: number,
) {
  const recipe = recipeBook[head.recipeItemType]

  const targetTicks = head.count * recipe.ticks
  invariant(head.ticks < targetTicks)

  const ticksRemaining = targetTicks - head.ticks

  // if ticksRemaining is < 1, consumption will be scaled accordingly
  const demand = Math.min(ticksRemaining / scale, 1)

  return { recipe, demand, targetTicks }
}

export function preTickHandAssembler(
  _world: World,
  entity: HandAssemblerEntity,
): EntityPreTickResult | null {
  const head = entity.queue.at(0)
  if (!head) {
    return null
  }
  const { scale } = entity

  const result: EntityPreTickResult = {
    consumption: {
      items: {},
    },
  }

  const { recipe, demand } = getTickContext(head, scale)

  for (const [itemType, count] of iterateRecipeInput({
    recipe,
    scale,
    demand,
  })) {
    invariant(count > 0)
    invariant(!result.consumption.items[itemType])
    result.consumption.items[itemType] = count
  }

  return result
}

export function tickHandAssembler(
  _world: World,
  entity: HandAssemblerEntity,
  satisfaction: number,
): EntityTickResult | null {
  const head = entity.queue.at(0)
  invariant(head)

  const { scale } = entity
  const { recipe, demand, targetTicks } = getTickContext(
    head,
    scale,
  )

  const result: EntityTickResult = {
    production: {
      items: {},
    },
  }

  for (const [itemType, count] of iterateRecipeOutput({
    recipe,
    scale,
    demand,
    satisfaction,
  })) {
    invariant(count > 0)
    invariant(!result.production.items[itemType])
    result.production.items[itemType] = count
  }

  head.ticks += satisfaction * demand * scale

  if (gte(head.ticks, targetTicks)) {
    entity.queue.shift()
  }

  return result
}
