import invariant from 'tiny-invariant'
import {
  COMBUSTION_MINER_COAL_PER_TICK,
  COMBUSTION_MINER_PRODUCTION_PER_TICK,
} from './const.js'
import {
  EntityPreTickResult,
  EntityTickResult,
  PreTickFn,
  TickFn,
} from './tick-util.js'
import { CombustionMinerEntity, FuelType } from './world.js'

export const preTickCombustionMiner: PreTickFn<
  CombustionMinerEntity
> = (_world, entity) => {
  const result: EntityPreTickResult = {
    consumption: { items: {} },
  }

  const { scale } = entity

  invariant(entity.fuelType === FuelType.enum.Coal)
  result.consumption.items[entity.fuelType] =
    COMBUSTION_MINER_COAL_PER_TICK * scale

  return result
}

export const tickCombustionMiner: TickFn<
  CombustionMinerEntity
> = (_world, entity, satisfaction) => {
  const { scale } = entity

  const result: EntityTickResult = {
    production: { items: {} },
  }

  result.production.items[entity.resourceType] =
    COMBUSTION_MINER_PRODUCTION_PER_TICK *
    scale *
    satisfaction

  return result
}
