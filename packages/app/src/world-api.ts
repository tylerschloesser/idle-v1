import { createNoise3D } from 'simplex-noise'
import invariant from 'tiny-invariant'
import {
  CellType,
  Chunk,
  World,
  cellType,
  world,
} from './world.js'

const noise3d = createNoise3D()
function noise(x: number, y: number, z: number): number {
  const v = noise3d(x, y, z)
  return (v + 1) / 2
}

export async function loadWorld(
  id: string,
): Promise<World | null> {
  const key = `world.${id}`
  const item = self.localStorage.getItem(key)
  if (!item) return null
  const value = world.parse(JSON.parse(item))
  console.debug('loaded world from localStorage')
  return value
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
      const v = noise(xx * scale, yy * scale, 1)
      let type: CellType
      if (v < 0.5) {
        type = cellType.enum.Dirt1
      } else {
        type = cellType.enum.Grass1
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

  const value: World = { id, chunkSize, chunks }
  console.debug('generated new world', value)
  return value
}
