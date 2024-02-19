import { EntityId } from '@reduxjs/toolkit'
import invariant from 'tiny-invariant'
import { tickCombustionMiner } from './tick-combustion-miner.js'
import { tickCombustionSmelter } from './tick-combustion-smelter.js'
import { tickGenerator } from './tick-generator.js'
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
import { iterateItems } from './util.js'
import {
  Entity,
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
    switch (entity.type) {
      case EntityType.enum.HandMiner:
        pushPreTickResult(
          entity,
          preTickHandMiner(world, entity),
        )
        break
      case EntityType.enum.HandAssembler:
        pushPreTickResult(
          entity,
          preTickHandAssembler(world, entity),
        )
        break
    }
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

    let tickResult: EntityTickResult | null = null

    switch (entity.type) {
      case EntityType.enum.HandMiner: {
        tickResult = tickHandMiner(
          world,
          entity,
          satisfaction,
        )
        break
      }
      case EntityType.enum.HandAssembler: {
        tickResult = tickHandAssembler(
          world,
          entity,
          satisfaction,
        )
        break
      }
      case EntityType.enum.CombustionSmelter: {
        tickCombustionSmelter(world, entity)
        break
      }
      case EntityType.enum.CombustionMiner:
        tickCombustionMiner(world, entity)
        break
      case EntityType.enum.Generator:
        tickGenerator(world, entity)
        break
    }

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
