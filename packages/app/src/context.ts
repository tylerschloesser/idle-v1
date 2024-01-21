import { createContext } from 'react'
import { EntityType, ItemType, World } from './world.js'

export interface IContext {
  world: World
  addItemToInventory(itemType: ItemType): void
  buildEntity(entityType: EntityType): void
}

export const Context = createContext<IContext>(null!)
