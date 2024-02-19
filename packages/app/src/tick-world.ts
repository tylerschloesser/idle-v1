import { EntityId } from '@reduxjs/toolkit'
import invariant from 'tiny-invariant'
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
  const preTickResults: Record<
    EntityId,
    EntityPreTickResult
  > = {}

  function pushPreTickResult(
    entityId: EntityId,
    result: EntityPreTickResult | null,
  ): void {
    if (result) {
      preTickResults[entityId] = result
    }
  }

  for (const entity of Object.values(world.entities)) {
    switch (entity.type) {
      case EntityType.enum.HandAssembler:
        pushPreTickResult(
          entity.id,
          preTickHandAssembler(world, entity),
        )
        break
    }
  }

  for (const entity of Object.values(world.entities)) {
    entity.metrics.pop()
    entity.metrics.unshift([])

    switch (entity.type) {
      case EntityType.enum.HandMiner: {
        tickHandMiner(world, entity)
        break
      }
      case EntityType.enum.HandAssembler: {
        const preTickResult = preTickResults[entity.id]
        if (preTickResult) {
          invariant(preTickResult.type === entity.type)
          tickHandAssembler(
            world,
            entity,
            preTickResult.context,
            1,
          )
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
