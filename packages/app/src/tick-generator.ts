import { GENERATOR_COAL_PER_TICK } from './const.js'
import {
  EntityPreTickResult,
  PreTickFn,
  TickFn,
} from './tick-util.js'
import {
  FuelType,
  GeneratorEntity,
  World,
} from './world.js'

/* eslint-disable @typescript-eslint/no-unused-vars */

export const preTickGenerator: PreTickFn<
  GeneratorEntity
> = (world, entity) => {
  const result: EntityPreTickResult = {
    consumption: { items: {} },
  }

  const { scale } = entity

  result.consumption.items[FuelType.enum.Coal] =
    GENERATOR_COAL_PER_TICK * scale

  return result
}

export const tickGenerator: TickFn<GeneratorEntity> = (
  world,
  entity,
  satisfaction,
) => {
  return null
}
