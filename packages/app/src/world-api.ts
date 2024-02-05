import invariant from 'tiny-invariant'
import { ZodError } from 'zod'
import { TICK_RATE } from './const.js'
import { tickWorld } from './tick-world.js'
import { getIsoDiffMs, ticksToTime } from './util.js'
import {
  Block,
  BufferEntity,
  EntityType,
  Group,
  HandAssemblerEntity,
  HandMinerEntity,
  Stats,
  WORLD_VERSION,
  World,
} from './world.js'

function getKey(id: string): string {
  return `world.${id}`
}

function getTicksToFastForward(world: World): number {
  const elapsed = getIsoDiffMs(world.lastTick)
  return Math.floor(elapsed / TICK_RATE)
}

export async function fastForward(
  world: World,
): Promise<void> {
  const ticksToFastForward = getTicksToFastForward(world)

  const start = self.performance.now()
  for (let i = 0; i < ticksToFastForward; i++) {
    tickWorld(world)
  }
  const elapsed = self.performance.now() - start
  console.log(
    `Fast forwarded ${ticksToFastForward} tick(s)/${ticksToTime(ticksToFastForward)} in ${Math.ceil(elapsed)}ms`,
  )
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

/* eslint-disable @typescript-eslint/no-unused-vars */
function migrate(_world: World): void {}
/* eslint-enable @typescript-eslint/no-unused-vars */

export async function loadWorld(
  id: string,
): Promise<World | null> {
  const key = getKey(id)
  const item = self.localStorage.getItem(key)
  if (!item) return null
  try {
    const value = World.parse(JSON.parse(item))
    console.debug('Loaded world from localStorage')
    await fastForward(value)
    migrate(value)
    return value
  } catch (e) {
    if (e instanceof ZodError) {
      console.error('Failed to parse world', e)
      if (
        self.confirm(
          'Failed to parse world. Clear and reload?',
        )
      ) {
        localStorage.removeItem(key)
        self.location.reload()
        await new Promise(() => {})
      }
    }
    throw e
  }
}

export async function saveWorld(
  world: World,
): Promise<void> {
  World.parse(world)
  self.localStorage.setItem(
    getKey(world.id),
    JSON.stringify(world),
  )
}

export async function generateWorld(
  id: string,
): Promise<World> {
  const lastTick: World['lastTick'] =
    new Date().toISOString()

  const version = WORLD_VERSION.value

  const world: World = World.parse({
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
  })

  addInitialEntities(world)

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
  }

  world.entities[initialHandMiner.id] = initialHandMiner
  world.entities[initialHandAssembler.id] =
    initialHandAssembler
  world.entities[initialBuffer.id] = initialBuffer

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
      [initialHandAssembler.id]: true,
      [initialBuffer.id]: true,
    },
  }
  world.groups[group.id] = group

  const block: Block = {
    id: blockId,
    groupIds: {
      [groupId]: true,
    },
  }
  world.blocks[block.id] = block
}
