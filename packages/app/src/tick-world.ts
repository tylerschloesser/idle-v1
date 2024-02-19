import { EntityId } from '@reduxjs/toolkit'
import { tickCombustionMiner } from './tick-combustion-miner.js'
import { tickCombustionSmelter } from './tick-combustion-smelter.js'
import { tickGenerator } from './tick-generator.js'
import {
  preTickHandAssembler,
  tickHandAssembler,
} from './tick-hand-assembler.js'
import { tickHandMiner } from './tick-hand-miner.js'
import { EntityPreTickResult } from './tick-util.js'
import { EntityType, World } from './world.js'

export function tickWorld(world: World): void {
  const entityIdToPreTickResult: Partial<
    Record<EntityId, EntityPreTickResult | null>
  > = {}

  for (const entity of Object.values(world.entities)) {
    let preTickResult: EntityPreTickResult | null = null
    switch (entity.type) {
      case EntityType.enum.HandAssembler:
        preTickResult = preTickHandAssembler(world, entity)
        break
    }
    entityIdToPreTickResult[entity.id] = preTickResult
  }

  for (const entity of Object.values(world.entities)) {
    entity.metrics.pop()
    entity.metrics.unshift([])

    const preTickResult = entityIdToPreTickResult[entity.id]

    switch (entity.type) {
      case EntityType.enum.HandMiner: {
        tickHandMiner(world, entity)
        break
      }
      case EntityType.enum.HandAssembler: {
        if (preTickResult) {
          tickHandAssembler(world, entity, 1)
        }
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
  }

  world.tick += 1
  world.lastTick = new Date().toISOString()
}
