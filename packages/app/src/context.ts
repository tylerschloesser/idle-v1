import { createContext } from 'react'
import { ItemType, World } from './world.js'

export interface IContext {
  world: World
  addItemToInventory(itemType: ItemType): void
}

export const Context = createContext<IContext>(null!)
