import invariant from 'tiny-invariant'
import {
  preTickCombustionMiner,
  tickCombustionMiner,
} from './tick-combustion-miner.js'
import {
  preTickCombustionSmelter,
  tickCombustionSmelter,
} from './tick-combustion-smelter.js'
import {
  preTickGenerator,
  tickGenerator,
} from './tick-generator.js'
import {
  preTickHandAssembler,
  tickHandAssembler,
} from './tick-hand-assembler.js'
import {
  preTickHandMiner,
  tickHandMiner,
} from './tick-hand-miner.js'
import {
  EntityPreTickResult,
  EntityTickResult,
} from './tick-util.js'
import { gte, iterateItems } from './util.js'
import {
  BlockId,
  Entity,
  EntityId,
  EntityType,
  ItemType,
  TickMetric,
  TickMetricType,
  World,
} from './world.js'

export function tickWorld(world: World): void {
  const entityIdToPreTickResult: Partial<
    Record<EntityId, EntityPreTickResult>
  > = {}

  const blockIdToConsumption: Record<
    BlockId,
    Partial<Record<ItemType, number>>
  > = {}

  for (const entity of Object.values(world.entities)) {
    // reset latest tick metrics
    entity.metrics.pop()
    entity.metrics.unshift([])

    const preTickResult = getPreTickResult(world, entity)

    if (preTickResult === null) {
      continue
    }
    entityIdToPreTickResult[entity.id] = preTickResult

    if (
      Object.keys(preTickResult.consumption.items)
        .length === 0
    ) {
      continue
    }

    let consumption = blockIdToConsumption[entity.blockId]
    if (!consumption) {
      consumption = blockIdToConsumption[entity.blockId] =
        {}
    }

    for (const [itemType, count] of iterateItems(
      preTickResult.consumption.items,
    )) {
      consumption[itemType] =
        (consumption[itemType] ?? 0) + count
    }
  }

  const blockIdToItemTypeToSatisfaction: Record<
    BlockId,
    Partial<Record<ItemType, number>>
  > = {}

  for (const [blockId, consumption] of Object.entries(
    blockIdToConsumption,
  )) {
    const block = world.blocks[blockId]
    invariant(block)

    const itemTypeToSatisfaction: Partial<
      Record<ItemType, number>
    > = {}

    for (const [itemType, count] of iterateItems(
      consumption,
    )) {
      invariant(
        itemTypeToSatisfaction[itemType] === undefined,
      )
      itemTypeToSatisfaction[itemType] = Math.min(
        (block.items[itemType]?.count ?? 0) / count,
        1,
      )
      invariant(itemTypeToSatisfaction[itemType]! >= 0)
      invariant(itemTypeToSatisfaction[itemType]! <= 1)
    }

    blockIdToItemTypeToSatisfaction[blockId] =
      itemTypeToSatisfaction
  }

  const entityIdToTickResult: Partial<
    Record<EntityId, EntityTickResult>
  > = {}

  for (const entity of Object.values(world.entities)) {
    const metrics = entity.metrics.at(0)
    invariant(metrics)

    const block = world.blocks[entity.blockId]
    invariant(block)

    const preTickResult = entityIdToPreTickResult[entity.id]
    if (!preTickResult) {
      continue
    }

    const itemTypeToSatisfaction =
      blockIdToItemTypeToSatisfaction[entity.blockId]
    invariant(itemTypeToSatisfaction)

    let satisfaction = 1

    if (
      Object.keys(preTickResult.consumption.items).length >
      0
    ) {
      for (const [itemType] of iterateItems(
        preTickResult.consumption.items,
      )) {
        invariant(
          itemTypeToSatisfaction[itemType] !== undefined,
        )
        satisfaction = Math.min(
          satisfaction,
          itemTypeToSatisfaction[itemType]!,
        )
        if (satisfaction === 0) {
          break
        }
      }
    }

    if (satisfaction === 0) {
      continue
    }

    if (
      Object.keys(preTickResult.consumption.items).length >
      0
    ) {
      for (const [itemType, count] of iterateItems(
        preTickResult.consumption.items,
      )) {
        const item = block.items[itemType]
        invariant(item)

        const consumed = count * satisfaction
        invariant(gte(item.count, consumed))

        item.count = Math.max(item.count - consumed, 0)

        const itemSatisfaction =
          itemTypeToSatisfaction[itemType]
        invariant(itemSatisfaction)

        metrics.push({
          type: TickMetricType.enum.ConsumeItem,
          entityId: entity.id,
          count: consumed,
          itemType,
          satisfaction: itemSatisfaction,
        })
      }
    }

    const tickResult = getTickResult(
      world,
      entity,
      satisfaction,
    )

    if (tickResult) {
      entityIdToTickResult[entity.id] = tickResult
    }
  }

  // consume all remaining power
  for (const block of Object.values(world.blocks)) {
    const power = block.items[ItemType.enum.Power]
    if (power) {
      power.count = 0
    }
  }

  for (const entity of Object.values(world.entities)) {
    const metrics = entity.metrics.at(0)
    invariant(metrics)

    const block = world.blocks[entity.blockId]
    invariant(block)

    const tickResult = entityIdToTickResult[entity.id]

    if (tickResult) {
      for (const [itemType, count] of iterateItems(
        tickResult.production.items,
      )) {
        let item = block.items[itemType]
        if (!item) {
          item = block.items[itemType] = {
            condition: 1,
            count: 0,
          }
        }
        item.count += count

        metrics.push({
          type: TickMetricType.enum.ProduceItem,
          itemType,
          count,
          entityId: entity.id,
          productivity: tickResult.productivity,
        })
      }
    }
  }

  world.tick += 1
  world.lastTick = new Date().toISOString()
}

function getTickResult(
  world: World,
  entity: Entity,
  satisfaction: number,
): EntityTickResult | null {
  switch (entity.type) {
    case EntityType.enum.HandMiner: {
      return tickHandMiner(world, entity, satisfaction)
    }
    case EntityType.enum.HandAssembler: {
      return tickHandAssembler(world, entity, satisfaction)
    }
    case EntityType.enum.CombustionSmelter: {
      return tickCombustionSmelter(
        world,
        entity,
        satisfaction,
      )
    }
    case EntityType.enum.CombustionMiner:
      return tickCombustionMiner(
        world,
        entity,
        satisfaction,
      )
    case EntityType.enum.Generator:
      return tickGenerator(world, entity, satisfaction)
  }
  invariant(false, `TODO implement tick for ${entity.type}`)
}

function getPreTickResult(
  world: World,
  entity: Entity,
): EntityPreTickResult | null {
  switch (entity.type) {
    case EntityType.enum.HandMiner:
      return preTickHandMiner(world, entity)
    case EntityType.enum.HandAssembler:
      return preTickHandAssembler(world, entity)
    case EntityType.enum.CombustionSmelter:
      return preTickCombustionSmelter(world, entity)
    case EntityType.enum.CombustionMiner:
      return preTickCombustionMiner(world, entity)
    case EntityType.enum.Generator:
      return preTickGenerator(world, entity)
  }

  invariant(
    false,
    `TODO implement preTick for ${entity.type}`,
  )
}
