import { World, world } from './world.js'

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

export async function generateWorld(
  id: string,
): Promise<World> {
  const value: World = { id, chunks: {} }
  console.debug('generated new world')
  return value
}
