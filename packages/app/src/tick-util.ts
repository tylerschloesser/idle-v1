import invariant from 'tiny-invariant'
import { COMBUSTION_SMELTER_COAL_PER_TICK } from './const.js'
import {
  AssemblerRecipe,
  CombustionSmelterEntity,
  Entity,
  ItemType,
  SmelterRecipe,
  World,
} from './world.js'

export function* iterateRecipeInput({
  recipe,
  demand = 1,
  scale = 1,
}: {
  recipe: AssemblerRecipe | SmelterRecipe
  demand?: number
  scale?: number
}): Generator<[ItemType, number]> {
  invariant(scale > 0)
  invariant(demand > 0)
  invariant(demand <= 1)

  for (const [itemType, count] of Object.entries(
    recipe.input,
  )) {
    yield [
      ItemType.parse(itemType),
      (count / recipe.ticks) * demand * scale,
    ]
  }
}

export function* iterateCombustionSmelterRecipeInput({
  entity,
  recipe,
  satisfaction = 1,
  scale = 1,
}: {
  entity: CombustionSmelterEntity
  recipe: SmelterRecipe
  satisfaction?: number
  scale?: number
}): Generator<[ItemType, number]> {
  invariant(entity.fuelType === ItemType.enum.Coal)

  yield [
    ItemType.enum.Coal,
    COMBUSTION_SMELTER_COAL_PER_TICK * scale * satisfaction,
  ]

  for (const value of iterateRecipeInput({
    recipe,
    demand: satisfaction,
    scale,
  })) {
    yield value
  }
}

export function* iterateRecipeOutput({
  recipe,
  scale = 1,
  demand = 1,
  satisfaction,
}: {
  recipe: AssemblerRecipe | SmelterRecipe
  scale?: number
  demand?: number
  satisfaction: number
}): Generator<[ItemType, number]> {
  invariant(scale > 0)
  invariant(demand > 0)
  invariant(demand <= 1)
  for (const [itemType, count] of Object.entries(
    recipe.output,
  )) {
    yield [
      ItemType.parse(itemType),
      (count / recipe.ticks) *
        demand *
        scale *
        satisfaction,
    ]
  }
}

export interface EntityPreTickResult {
  consumption: {
    items: Partial<Record<ItemType, number>>
  }
}

export interface EntityTickResult {
  production: {
    items: Partial<Record<ItemType, number>>
  }
}

export type PreTickFn<T extends Entity> = (
  world: World,
  entity: T,
) => EntityPreTickResult | null

export type TickFn<T extends Entity> = (
  world: World,
  entity: T,
  satisfaction: number,
) => EntityTickResult | null
