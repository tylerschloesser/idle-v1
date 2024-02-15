import invariant from 'tiny-invariant'
import {
  HAND_MINE_PRODUCTION_PER_TICK,
  HAND_MINE_TICK_COUNT,
} from './const.js'
import { produce } from './tick-util.js'
import {
  EntityType,
  HandMinerEntity,
  World,
} from './world.js'

export function tickHandMiner(
  world: World,
  entity: HandMinerEntity,
): void {
  const head = entity.queue.at(0)
  if (!head) {
    return
  }

  const targetTicks = head.count * HAND_MINE_TICK_COUNT
  invariant(head.ticks < targetTicks)

  invariant(Object.keys(entity.output).length === 1)

  const outputEntityId = Object.keys(entity.output).at(0)
  invariant(outputEntityId)

  const output = world.entities[outputEntityId]
  invariant(output?.type === EntityType.enum.Buffer)

  produce({
    output,
    itemType: head.resourceType,
    count: HAND_MINE_PRODUCTION_PER_TICK * entity.scale,
  })

  head.ticks += 1
  if (head.ticks >= targetTicks) {
    entity.queue.shift()
  }
}
