import invariant from 'tiny-invariant'
import { COMBUSTION_SMELTER_COAL_PER_TICK } from './const.js'
import { recipeBook } from './recipe-book.js'
import {
  EntityPreTickResult,
  EntityTickResult,
  PreTickFn,
  TickFn,
  iterateRecipeInput,
  iterateRecipeOutput,
} from './tick-util.js'
import {
  CombustionSmelterEntity,
  FuelType,
} from './world.js'

export const preTickCombustionSmelter: PreTickFn<
  CombustionSmelterEntity
> = (_world, entity) => {
  const result: EntityPreTickResult = {
    consumption: { items: {} },
  }

  const { scale } = entity

  invariant((entity.fuelType = FuelType.enum.Coal))
  result.consumption.items[entity.fuelType] =
    COMBUSTION_SMELTER_COAL_PER_TICK * scale

  const recipe = recipeBook[entity.recipeItemType]

  for (const [itemType, count] of iterateRecipeInput({
    recipe,
    scale,
  })) {
    invariant(
      result.consumption.items[itemType] === undefined,
    )
    result.consumption.items[itemType] = count
  }

  return null
}

export const tickCombustionSmelter: TickFn<
  CombustionSmelterEntity
> = (_world, entity, satisfaction) => {
  const { scale } = entity
  const recipe = recipeBook[entity.recipeItemType]

  const result: EntityTickResult = {
    production: { items: {} },
  }

  for (const [itemType, count] of iterateRecipeOutput({
    recipe,
    scale,
    satisfaction,
  })) {
    invariant(
      result.production.items[itemType] === undefined,
    )
    result.production.items[itemType] = count
  }

  return result
}
