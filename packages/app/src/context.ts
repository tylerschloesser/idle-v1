import { createContext } from 'react'
import {
  EntityId,
  EntityType,
  ItemType,
  ResourceType,
  World,
} from './world.js'

export interface IContext {
  world: World
  addItemToInventory(itemType: ItemType): void
  buildEntity(entityType: EntityType): void
  setStoneFurnaceRecipe(
    id: EntityId,
    recipeItemType: ItemType | null,
  ): void
  setStoneFurnaceEnabled(
    id: EntityId,
    enabled: boolean,
  ): void
  setBurnerMiningDrillResourceType(
    id: EntityId,
    resourceType: ResourceType | null,
  ): void
  setBurnerMiningDrillEnabled(
    id: EntityId,
    enabled: boolean,
  ): void
}

export const Context = createContext<IContext>(null!)
