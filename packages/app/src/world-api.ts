import { ZodError } from 'zod'
import { TICK_RATE } from './const.js'
import { tickWorld } from './tick-world.js'
import { getIsoDiffMs, ticksToTime } from './util.js'
import { World } from './world.js'

function getKey(id: string): string {
  return `world.${id}`
}

export function getTicksToFastForward(
  world: World,
): number {
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
