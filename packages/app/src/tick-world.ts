import { World } from './world.js'

export function tickWorld(world: World): void {
  world.tick += 1
  world.lastTick = new Date().toISOString()
}
