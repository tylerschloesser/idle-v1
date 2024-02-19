import invariant from 'tiny-invariant'
import { recipeBook } from './recipe-book.js'
import {
  EntityTickResult,
  HandAssemblerEntityPreTickResult,
  HandAssemblerTickContext,
  iterateRecipeInput,
  iterateRecipeOutput,
} from './tick-util.js'
import { gte } from './util.js'
import {
  EntityType,
  HandAssemblerEntity,
  World,
} from './world.js'

export interface TickContext {}

export function preTickHandAssembler(
  _world: World,
  entity: HandAssemblerEntity,
): HandAssemblerEntityPreTickResult | null {
  const head = entity.queue.at(0)
  if (!head) {
    return null
  }
  const { scale } = entity

  const recipe = recipeBook[head.recipeItemType]

  const targetTicks = head.count * recipe.ticks
  invariant(head.ticks < targetTicks)

  const ticksRemaining = targetTicks - head.ticks

  // if ticksRemaining is < 1, consumption will be scaled accordingly
  const demand = Math.min(ticksRemaining / scale, 1)

  const result: HandAssemblerEntityPreTickResult = {
    type: EntityType.enum.HandAssembler,
    consumption: {
      items: {},
    },
    context: {
      head,
      recipe,
      demand,
      targetTicks,
    },
  }

  for (const [itemType, count] of iterateRecipeInput({
    recipe,
    scale,
    demand,
  })) {
    invariant(!result.consumption.items[itemType])
    result.consumption.items[itemType] = count
  }

  return result
}

export function tickHandAssembler(
  _world: World,
  entity: HandAssemblerEntity,
  context: HandAssemblerTickContext,
  satisfaction: number,
): EntityTickResult | null {
  const { scale } = entity
  const { head, recipe, demand, targetTicks } = context

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
    invariant(!result.production.items[itemType])
    result.production.items[itemType] = count
  }

  head.ticks += satisfaction * demand * scale

  if (gte(head.ticks, targetTicks)) {
    entity.queue.shift()
  }

  return result
}
