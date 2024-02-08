import invariant from 'tiny-invariant'
import { TICK_RATE } from './const.js'
import {
  Block,
  BufferEntity,
  EntityType,
  Group,
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
    groups: {},
    entities: {},
    power: 0,
    stats: buildStats(),
    log: [
      {
        tick: 0,
        message: `Generated new world on ${new Date().toISOString()}, version ${version}`,
      },
    ],

    nextEntityId: 0,
    nextGroupId: 0,
  }

  addInitialEntities(world)

  // validate
  World.parse(world)

  console.debug('Generated new world', world)
  return world
}

function addInitialEntities(world: World): void {
  const blockId = '0.0'
  const groupId = `${world.nextGroupId++}`

  const initialHandMiner: HandMinerEntity = {
    type: EntityType.enum.HandMiner,
    id: `${world.nextEntityId++}`,
    condition: 1,
    groupId,
    input: {},
    output: {},
    queue: [],
    scale: 1,
    visible: true,
  }

  const initialBuffer: BufferEntity = {
    type: EntityType.enum.Buffer,
    id: `${world.nextEntityId++}`,
    condition: 1,
    groupId,
    input: {},
    output: {},
    contents: {},
    scale: 1,
    visible: true,
  }

  const initialHandAssembler: HandAssemblerEntity = {
    type: EntityType.enum.HandAssembler,
    id: `${world.nextEntityId++}`,
    condition: 1,
    groupId,
    input: {},
    output: {},
    queue: [],
    scale: 1,
    visible: true,
  }

  world.entities[initialHandMiner.id] = initialHandMiner
  world.entities[initialBuffer.id] = initialBuffer
  world.entities[initialHandAssembler.id] =
    initialHandAssembler

  // connect hand miner -> buffer
  initialHandMiner.output[initialBuffer.id] = true
  initialBuffer.input[initialHandMiner.id] = true

  // connect hand assembler -> buffer
  initialHandAssembler.output[initialBuffer.id] = true
  initialBuffer.input[initialHandAssembler.id] = true

  // connect buffer -> hand assembler
  initialBuffer.output[initialHandAssembler.id] = true
  initialHandAssembler.input[initialBuffer.id] = true

  const group: Group = {
    id: groupId,
    blockId,
    entityIds: {
      [initialHandMiner.id]: true,
      [initialBuffer.id]: true,
      [initialHandAssembler.id]: true,
    },
  }
  world.groups[group.id] = group

  const block: Block = {
    id: blockId,
    groupIds: {
      [groupId]: true,
    },
    resources: {
      [ResourceType.enum.Coal]: 100_000,
      [ResourceType.enum.Stone]: 100_000,
      [ResourceType.enum.IronOre]: 100_000,
      [ResourceType.enum.CopperOre]: 100_000,
    },
  }
  world.blocks[block.id] = block
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
