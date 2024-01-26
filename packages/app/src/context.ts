import { createContext } from 'react'
import {
  AssemblerRecipeItemType,
  EntityId,
  EntityType,
  FurnaceRecipeItemType,
  ItemType,
  ResourceType,
  World,
} from './world.js'

export interface IContext {
  world: World
  addItemToInventory(itemType: ItemType): void
  buildEntity(entityType: EntityType): void
  destroyEntity(entityId: EntityId): void
  setStoneFurnaceRecipe(
    id: EntityId,
    recipeItemType: FurnaceRecipeItemType | null,
  ): void
  setBurnerMiningDrillResourceType(
    id: EntityId,
    resourceType: ResourceType | null,
  ): void
  setAssemblerRecipe(
    id: EntityId,
    recipeItemType: AssemblerRecipeItemType | null,
  ): void
  setEntityEnabled(id: EntityId, enabled: boolean): void
}

export const Context = createContext<IContext>(null!)
