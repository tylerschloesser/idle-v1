import invariant from 'tiny-invariant'
import {
  HAND_MINE_PRODUCTION_PER_TICK,
  HAND_MINE_TICK_COUNT,
} from './const.js'
import {
  EntityTickResult,
  PreTickFn,
  TickFn,
} from './tick-util.js'
import { HandMinerEntity, World } from './world.js'

export const preTickHandMiner: PreTickFn<
  HandMinerEntity
> = (_world, entity) => {
  const head = entity.queue.at(0)
  if (!head) {
    return null
  }
  return { consumption: { items: {} } }
}

export const tickHandMiner: TickFn<HandMinerEntity> = (
  _world: World,
  entity: HandMinerEntity,
  // eslint-disable-next-line
  _satisfaction: number,
) => {
  const head = entity.queue.at(0)
  invariant(head)

  const targetTicks = head.count * HAND_MINE_TICK_COUNT
  invariant(head.ticks < targetTicks)

  const result: EntityTickResult = {
    production: { items: {} },
  }

  result.production.items[head.resourceType] =
    HAND_MINE_PRODUCTION_PER_TICK * entity.scale

  head.ticks += 1
  if (head.ticks >= targetTicks) {
    entity.queue.shift()
  }

  return result
}
