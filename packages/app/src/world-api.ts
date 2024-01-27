import { createNoise3D } from 'simplex-noise'
import invariant from 'tiny-invariant'
import { ZodError } from 'zod'
import { TICK_RATE } from './const.js'
import { tickWorld } from './tick-world.js'
import { getIsoDiffMs } from './util.js'
import {
  AssemblerRecipeItemType,
  AssemblerRecipes,
  CellType,
  Chunk,
  EntityRecipes,
  EntityType,
  FurnaceRecipes,
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

function ticksToTime(ticks: number): string {
  const seconds = (ticks * TICK_RATE) / 1000
  if (seconds < 60) {
    return `${seconds.toFixed(1)} second(s)`
  }
  const minutes = seconds / 60
  if (minutes < 60) {
    return `${minutes.toFixed(1)} minute(s)`
  }

  const hours = minutes / 60
  if (hours < 24) {
    return `${hours.toFixed(1)} hour(s)`
  }

  const days = hours / 24
  return `${days.toFixed(1)} day(s)`
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

/* eslint-disable @typescript-eslint/no-unused-vars */
function migrate(world: World): void {
  if (!world.groups) {
    world.groups = {}
  }
}
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

  const entityRecipes: EntityRecipes = {
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
    [EntityType.enum.Generator]: {
      ticks: 0,
      input: {
        [ItemType.enum.Stone]: 20,
        [ItemType.enum.IronPlate]: 50,
      },
    },
    [EntityType.enum.Assembler]: {
      ticks: 0,
      input: {
        [ItemType.enum.IronPlate]: 50,
      },
    },
    [EntityType.enum.Lab]: {
      ticks: 0,
      input: {
        [ItemType.enum.IronPlate]: 50,
        [ItemType.enum.IronGear]: 50,
        [ItemType.enum.ElectronicCircuit]: 50,
      },
    },
  }

  const furnaceRecipes: FurnaceRecipes = {
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
    [ItemType.enum.CopperPlate]: {
      ticks: 10,
      input: {
        [ItemType.enum.CopperOre]: 1,
      },
    },
  }

  const assemblerRecipes: AssemblerRecipes = {
    [AssemblerRecipeItemType.enum.IronGear]: {
      ticks: 10,
      input: {
        [ItemType.enum.IronPlate]: 2,
      },
    },
    [AssemblerRecipeItemType.enum.CopperWire]: {
      ticks: 5,
      input: {
        [ItemType.enum.CopperPlate]: 1,
      },
    },
    [AssemblerRecipeItemType.enum.ElectronicCircuit]: {
      ticks: 10,
      input: {
        [ItemType.enum.IronPlate]: 1,
        [ItemType.enum.CopperWire]: 1,
      },
    },
    [AssemblerRecipeItemType.enum.RedScience]: {
      ticks: 20,
      input: {
        [ItemType.enum.CopperPlate]: 1,
        [ItemType.enum.IronGear]: 1,
      },
    },
  }

  const inventoryLimits: InventoryLimits = {
    [ItemType.enum.Coal]: 100,
    [ItemType.enum.IronOre]: 100,
    [ItemType.enum.IronPlate]: 100,
    [ItemType.enum.Stone]: 100,
    [ItemType.enum.StoneBrick]: 100,
    [ItemType.enum.IronGear]: 100,
    [ItemType.enum.CopperOre]: 100,
    [ItemType.enum.CopperPlate]: 100,
    [ItemType.enum.CopperWire]: 100,
    [ItemType.enum.ElectronicCircuit]: 100,
    [ItemType.enum.RedScience]: 100,
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
    assemblerRecipes,
    entities: {},
    nextEntityId: 0,
    power: 0,
    stats: {
      index: 0,
      window: new Array(10).fill(null).map(() => ({
        production: {},
        consumption: {},
        powerProduction: 0,
        powerConsumption: 0,
      })),
    },
    groups: {},
  }
  console.debug('Generated new world', value)
  return value
}
