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
  getInputBuffer,
  getOutputBuffer,
} from './tick-util.js'
import { gte, iterateItems } from './util.js'
import {
  Entity,
  EntityId,
  EntityType,
  ItemType,
  World,
} from './world.js'

export function tickWorld(world: World): void {
  const entityIdToPreTickResult: Partial<
    Record<EntityId, EntityPreTickResult>
  > = {}

  const consumptionPerBuffer: Record<
    EntityId,
    Partial<Record<ItemType, number>>
  > = {}

  function pushPreTickResult(
    entity: Entity,
    result: EntityPreTickResult | null,
  ) {
    if (result === null) {
      return
    }
    entityIdToPreTickResult[entity.id] = result

    if (
      Object.keys(result.consumption.items).length === 0
    ) {
      return
    }

    const buffer = getInputBuffer(world, entity)

    let consumption = consumptionPerBuffer[buffer.id]
    if (!consumption) {
      consumption = consumptionPerBuffer[buffer.id] = {}
    }

    for (const [itemType, count] of iterateItems(
      result.consumption.items,
    )) {
      consumption[itemType] =
        (consumption[itemType] ?? 0) + count
    }
  }

  for (const entity of Object.values(world.entities)) {
    pushPreTickResult(
      entity,
      getPreTickResult(world, entity),
    )
  }

  const bufferIdToItemTypeToSatisfaction: Record<
    EntityId,
    Partial<Record<ItemType, number>>
  > = {}

  for (const [bufferId, consumption] of Object.entries(
    consumptionPerBuffer,
  )) {
    const buffer = world.entities[bufferId]
    invariant(buffer?.type === EntityType.enum.Buffer)
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
        (buffer.contents[itemType]?.count ?? 0) / count,
        1,
      )
      invariant(itemTypeToSatisfaction[itemType]! >= 0)
      invariant(itemTypeToSatisfaction[itemType]! <= 1)
    }
    bufferIdToItemTypeToSatisfaction[buffer.id] =
      itemTypeToSatisfaction
  }

  const entityIdToTickResult: Partial<
    Record<EntityId, EntityTickResult>
  > = {}

  for (const entity of Object.values(world.entities)) {
    entity.metrics.pop()
    entity.metrics.unshift([])

    const preTickResult = entityIdToPreTickResult[entity.id]
    if (!preTickResult) {
      continue
    }

    let satisfaction = 1

    if (
      Object.keys(preTickResult.consumption.items).length >
      0
    ) {
      const input = getInputBuffer(world, entity)
      const itemTypeToSatisfaction =
        bufferIdToItemTypeToSatisfaction[input.id]
      invariant(itemTypeToSatisfaction)

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
      const input = getInputBuffer(world, entity)
      for (const [itemType, count] of iterateItems(
        preTickResult.consumption.items,
      )) {
        const value = input.contents[itemType]
        invariant(value)
        invariant(gte(value.count, count))
        value.count = Math.max(value.count - count, 0)
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
  for (const entity of Object.values(world.entities)) {
    if (entity.type !== EntityType.enum.Buffer) {
      continue
    }
    const power = entity.contents[ItemType.enum.Power]
    if (power) {
      power.count = 0
    }
  }

  for (const entity of Object.values(world.entities)) {
    const tickResult = entityIdToTickResult[entity.id]

    if (tickResult) {
      const output = getOutputBuffer(world, entity)
      for (const [itemType, count] of iterateItems(
        tickResult.production.items,
      )) {
        let value = output.contents[itemType]
        if (!value) {
          value = output.contents[itemType] = {
            condition: 1,
            count: 0,
          }
        }
        value.count += count
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
    case EntityType.enum.Buffer:
      return null
  }

  invariant(
    false,
    `TODO implement preTick for ${entity.type}`,
  )
}
