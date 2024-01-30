import {
  Dispatch,
  SetStateAction,
  createContext,
} from 'react'
import invariant from 'tiny-invariant'
import { buildEntity } from './build-entity.js'
import { ROOT_GROUP_ID } from './const.js'
import {
  decrementRecipe,
  incrementItem,
} from './inventory.js'
import {
  Action,
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
  queueAction(action: Action): void
}

export const Context = createContext<IContext>(null!)

export function buildContext(
  world: World,
  setWorld: Dispatch<SetStateAction<World | null>>,
): IContext {
  const context: IContext = {
    world,
    addItemToInventory(itemType) {
      incrementItem(world, itemType, 1)
      setWorld({ ...world })
    },
    buildEntity(entityType) {
      const recipe = world.entityRecipes[entityType]
      invariant(recipe)
      decrementRecipe(world, recipe)
      const entity = buildEntity(
        world,
        entityType,
        ROOT_GROUP_ID,
      )
      invariant(!world.entities[entity.id])
      world.entities[entity.id] = entity

      setWorld({ ...world })
    },
    setStoneFurnaceRecipe(id, recipeItemType) {
      if (recipeItemType) {
        invariant(world.furnaceRecipes[recipeItemType])
      }
      const entity = world.entities[id]
      invariant(
        entity?.type === EntityType.enum.StoneFurnace,
      )
      entity.recipeItemType = recipeItemType

      setWorld({ ...world })
    },
    setAssemblerRecipe(id, recipeItemType) {
      if (recipeItemType) {
        invariant(world.assemblerRecipes[recipeItemType])
      }
      const entity = world.entities[id]
      invariant(entity?.type === EntityType.enum.Assembler)
      entity.recipeItemType = recipeItemType

      setWorld({ ...world })
    },
    setBurnerMiningDrillResourceType(id, resourceType) {
      const entity = world.entities[id]
      invariant(
        entity?.type === EntityType.enum.BurnerMiningDrill,
      )

      entity.resourceType = resourceType

      setWorld({ ...world })
    },
    setEntityEnabled(id, enabled) {
      const entity = world.entities[id]
      invariant(entity)
      entity.enabled = enabled
      setWorld({ ...world })
    },
    destroyEntity(entityId) {
      invariant(world.entities[entityId])
      delete world.entities[entityId]
      setWorld({ ...world })
    },
    queueAction(action) {
      world.actionQueue.push(action)
      setWorld({ ...world })
    },
  }
  return context
}
