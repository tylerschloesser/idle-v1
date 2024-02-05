import { createContext } from 'react'
import { World } from './world.js'

export interface IContext {
  world: World
  setWorld(cb: (world: World) => World): void
}

export const Context = createContext<IContext>(null!)

export function buildContext(
  world: World,
  setWorld: (cb: (world: World) => World) => void,
): IContext {
  const context: IContext = {
    world,
    setWorld,
  }
  return context
}
