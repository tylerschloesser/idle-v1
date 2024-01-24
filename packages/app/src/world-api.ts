import { createNoise3D } from 'simplex-noise'
import invariant from 'tiny-invariant'
import { ZodError } from 'zod'
import { TICK_RATE } from './const.js'
import { tickWorld } from './tick-world.js'
import { getIsoDiffMs } from './util.js'
import {
  CellType,
  Chunk,
  EntityType,
  Inventory,
  InventoryLimits,
  ItemType,
  WORLD_VERSION,
  World,
} from './world.js'

const noise3d = createNoise3D()
function noise(x: number, y: number, z: number): number {
  const v = noise3d(x, y, z)
  return (v + 1) / 2
}

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
    `Fast forwarded ${ticksToFastForward} tick(s) in ${Math.ceil(elapsed)}ms`,
  )
}

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
    return value
  } catch (e) {
    if (e instanceof ZodError) {
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
  self.localStorage.setItem(
    getKey(world.id),
    JSON.stringify(world),
  )
}

function generateChunk(
  x: number,
  y: number,
  size: number,
): Chunk {
  const cells: Chunk['cells'] = []
  for (let yy = 0; yy < size; yy++) {
    for (let xx = 0; xx < size; xx++) {
      const scale = 0.1
      const v = noise(
        (x * size + xx) * scale,
        (y * size + yy) * scale,
        1,
      )
      let type: CellType
      if (v < 0.33) {
        type = CellType.enum.Dirt1
      } else if (v < 0.66) {
        type = CellType.enum.Grass1
      } else {
        type = CellType.enum.Water1
      }
      cells.push({ type })
    }
  }

  invariant(cells.length === size ** 2)

  return {
    id: `${x}.${y}`,
    cells,
  }
}

export async function generateWorld(
  id: string,
): Promise<World> {
  const chunks: World['chunks'] = {}
  const chunkSize = 32
  for (let y = -1; y <= 0; y++) {
    for (let x = -1; x <= 0; x++) {
      const chunk = generateChunk(x, y, chunkSize)
      chunks[chunk.id] = chunk
    }
  }

  const inventory: Inventory = {}

  const entityRecipes: World['entityRecipes'] = {
    [EntityType.enum.StoneFurnace]: {
      ticks: 0,
      input: {
        [ItemType.enum.Stone]: 20,
      },
    },
    [EntityType.enum.BurnerMiningDrill]: {
      ticks: 0,
      input: {
        [ItemType.enum.Stone]: 20,
        [ItemType.enum.IronPlate]: 20,
      },
    },
  }

  const furnaceRecipes: World['furnaceRecipes'] = {
    [ItemType.enum.StoneBrick]: {
      ticks: 10,
      input: {
        [ItemType.enum.Stone]: 1,
      },
    },
    [ItemType.enum.IronPlate]: {
      ticks: 10,
      input: {
        [ItemType.enum.IronOre]: 1,
      },
    },
  }

  const inventoryLimits: InventoryLimits = {
    [ItemType.enum.Coal]: 100,
    [ItemType.enum.IronOre]: 100,
    [ItemType.enum.IronPlate]: 100,
    [ItemType.enum.Stone]: 100,
    [ItemType.enum.StoneBrick]: 100,
  }

  const lastTick: World['lastTick'] =
    new Date().toISOString()

  const value: World = {
    version: WORLD_VERSION.value,
    id,
    lastTick,
    tick: 0,
    chunkSize,
    chunks,
    inventory,
    inventoryLimits,
    entityRecipes,
    furnaceRecipes,
    entities: {},
    nextEntityId: 0,
  }
  console.debug('Generated new world', value)
  return value
}
