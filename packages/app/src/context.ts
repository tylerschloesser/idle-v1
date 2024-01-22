import { createContext } from 'react'
import {
  EntityId,
  EntityType,
  ItemType,
  World,
} from './world.js'

export interface IContext {
  world: World
  addItemToInventory(itemType: ItemType): void
  buildEntity(entityType: EntityType): void
  setStoneFurnaceRecipe(
    id: EntityId,
    itemType: ItemType | null,
  ): void
  setStoneFurnaceEnabled(
    id: EntityId,
    enabled: boolean,
  ): void
}

export const Context = createContext<IContext>(null!)
