import {
  GENERATOR_COAL_PER_TICK,
  GENERATOR_POWER_PER_TICK,
} from './const.js'
import {
  EntityPreTickResult,
  EntityTickResult,
  PreTickFn,
  TickFn,
} from './tick-util.js'
import {
  FuelType,
  GeneratorEntity,
  ItemType,
} from './world.js'

export const preTickGenerator: PreTickFn<
  GeneratorEntity
> = (_world, entity) => {
  const result: EntityPreTickResult = {
    consumption: { items: {} },
  }

  const { scale } = entity

  result.consumption.items[FuelType.enum.Coal] =
    GENERATOR_COAL_PER_TICK * scale

  return result
}

export const tickGenerator: TickFn<GeneratorEntity> = (
  _world,
  entity,
  satisfaction,
) => {
  const result: EntityTickResult = {
    production: {
      items: {
        [ItemType.enum.Power]:
          GENERATOR_POWER_PER_TICK *
          entity.scale *
          satisfaction,
      },
    },
  }
  return result
}
