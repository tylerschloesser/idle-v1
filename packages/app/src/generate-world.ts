import invariant from 'tiny-invariant'
import { TICK_RATE } from './const.js'
import {
  Block,
  EntityCardState,
  EntityType,
  HandAssemblerEntity,
  HandMinerEntity,
  ResourceType,
  Stats,
  WORLD_VERSION,
  World,
} from './world.js'

export async function generateWorld(
  id: string,
): Promise<World> {
  const lastTick: World['lastTick'] =
    new Date().toISOString()

  const version = WORLD_VERSION.value

  const world: World = {
    version,
    id,
    lastTick,
    tick: 0,
    blocks: {},
    entities: {},
    power: 0,
    stats: buildStats(),
    log: [
      {
        tick: 0,
        message: `Generated new world on ${new Date().toISOString()}, version ${version}`,
      },
    ],

    metrics: {},

    nextEntityId: 0,
  }

  addInitialEntities(world)

  // validate
  World.parse(world)

  console.debug('Generated new world', world)
  return world
}

export function initialCardState(): EntityCardState {
  return {
    visible: true,
    edit: false,
  }
}

function addInitialEntities(world: World): void {
  const blockId = '0.0'
  const block: Block = {
    id: blockId,
    entityIds: {},
    items: {},
    resources: {
      [ResourceType.enum.Coal]: 100_000,
      [ResourceType.enum.Stone]: 100_000,
      [ResourceType.enum.IronOre]: 100_000,
      [ResourceType.enum.CopperOre]: 100_000,
    },
  }
  world.blocks[block.id] = block

  const initialHandMiner: HandMinerEntity = {
    type: EntityType.enum.HandMiner,
    id: `${world.nextEntityId++}`,
    blockId,
    condition: 1,
    queue: [],
    scale: 1,
    cardState: initialCardState(),
  }

  const initialHandAssembler: HandAssemblerEntity = {
    type: EntityType.enum.HandAssembler,
    id: `${world.nextEntityId++}`,
    blockId,
    condition: 1,
    queue: [],
    scale: 1,
    cardState: initialCardState(),
  }

  for (const entity of [
    initialHandMiner,
    initialHandAssembler,
  ]) {
    world.entities[entity.id] = entity
    block.entityIds[entity.id] = true
    world.metrics[entity.id] = new Array(50)
      .fill(null)
      .map(() => ({
        satisfaction: 1,
        consumption: {
          items: {},
        },
        production: {
          items: {},
        },
      }))
  }
}

function buildStats(): Stats {
  const window = (1000 / TICK_RATE) * 5
  invariant(window === Math.floor(window))
  invariant(window === 50)
  return {
    window,
    production: new Array(window)
      .fill(null)
      .map(() => ({ power: 0, items: {} })),
    consumption: new Array(window).fill(null).map(() => ({
      power: 0,
      items: {},
    })),
  }
}
