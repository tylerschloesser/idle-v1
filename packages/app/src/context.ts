import { createContext } from 'react'
import { World } from './world.js'

export interface IContext {
  world: World
}

export const Context = createContext<IContext>(null!)
