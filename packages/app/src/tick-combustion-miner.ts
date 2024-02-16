import invariant from 'tiny-invariant'
import {
  COMBUSTION_MINER_COAL_PER_TICK,
  COMBUSTION_MINER_PRODUCTION_PER_TICK,
} from './const.js'
import {
  consume,
  getInputBuffer,
  getOutputBuffer,
  produce,
} from './tick-util.js'
import {
  CombustionMinerEntity,
  FuelType,
  World,
} from './world.js'

export function tickCombustionMiner(
  world: World,
  entity: CombustionMinerEntity,
): void {
  const { scale } = entity

  const input = getInputBuffer(world, entity)
  const output = getOutputBuffer(world, entity)

  invariant(entity.fuelType === FuelType.enum.Coal)

  const fuelDemand = COMBUSTION_MINER_COAL_PER_TICK * scale
  invariant(fuelDemand > 0)

  const satisfaction = Math.min(
    1,
    (input.contents[entity.fuelType]?.count ?? 0) /
      fuelDemand,
  )

  invariant(satisfaction >= 0)
  if (satisfaction === 0) {
    return
  }

  consume({
    entity,
    input,
    itemType: FuelType.enum.Coal,
    count: fuelDemand * satisfaction,
  })

  produce({
    entity,
    output,
    itemType: entity.resourceType,
    count:
      COMBUSTION_MINER_PRODUCTION_PER_TICK *
      scale *
      satisfaction,
  })
}
