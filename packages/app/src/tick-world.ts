import { tickCombustionSmelter } from './tick-combustion-smelter.js'
import { tickHandAssembler } from './tick-hand-assembler.js'
import { tickHandMiner } from './tick-hand-miner.js'
import { EntityType, World } from './world.js'

export function tickWorld(world: World): void {
  for (const entity of Object.values(world.entities)) {
    switch (entity.type) {
      case EntityType.enum.HandMiner: {
        tickHandMiner(world, entity)
        break
      }
      case EntityType.enum.HandAssembler: {
        tickHandAssembler(world, entity)
        break
      }
      case EntityType.enum.CombustionSmelter: {
        tickCombustionSmelter(world, entity)
        break
      }
    }
  }

  world.tick += 1
  world.lastTick = new Date().toISOString()
}
