import {
  Dispatch,
  SetStateAction,
  createContext,
} from 'react'
import { World } from './world.js'

export interface IContext {
  world: World
}

export const Context = createContext<IContext>(null!)

export function buildContext(
  world: World,
  setWorld: Dispatch<SetStateAction<World | null>>,
): IContext {
  const context: IContext = {
    world,
  }
  return context
}
