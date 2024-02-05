import invariant from 'tiny-invariant'
import { HAND_MINE_PRODUCTION_PER_TICK } from './const.js'
import {
  Entity,
  EntityType,
  HandMinerEntity,
  ItemType,
  World,
} from './world.js'

function outputToEntity(
  frame: Partial<
    Record<
      ItemType,
      {
        count: number
        condition: number
      }
    >
  >,
  target: Entity,
): void {
  invariant(target.type === EntityType.enum.Buffer)

  for (const [
    itemType,
    { count, condition },
  ] of Object.entries(frame)) {
    const key = ItemType.parse(itemType)

    let value = target.contents[key]
    if (!value) {
      value = target.contents[key] = {
        count: 0,
        condition: 1,
      }
    }

    // TODO
    invariant(condition === 1)
    invariant(value.condition === 1)

    value.count += count
  }
}

function tickHandMiner(
  world: World,
  entity: HandMinerEntity,
): void {
  const head = entity.queue.at(0)
  if (!head) {
    return
  }

  const targetTicks = head.count * 10
  invariant(head.ticks < targetTicks)

  invariant(Object.keys(entity.output).length === 1)

  const outputEntityId = Object.keys(entity.output).at(0)
  invariant(outputEntityId)

  const output = world.entities[outputEntityId]
  invariant(output)

  outputToEntity(
    {
      [head.resourceType]: {
        count: HAND_MINE_PRODUCTION_PER_TICK,
        condition: 1,
      },
    },
    output,
  )

  head.ticks += 1
  if (head.ticks >= targetTicks) {
    entity.queue.shift()
  }
}

export function tickWorld(world: World): void {
  for (const entity of Object.values(world.entities)) {
    switch (entity.type) {
      case EntityType.enum.HandMiner: {
        tickHandMiner(world, entity)
        break
      }
    }
  }

  world.tick += 1
  world.lastTick = new Date().toISOString()
}
