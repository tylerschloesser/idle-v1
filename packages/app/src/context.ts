import {
  Dispatch,
  SetStateAction,
  createContext,
} from 'react'
import invariant from 'tiny-invariant'
import {
  buildBurnerMiningDrill,
  buildStoneFurance,
} from './build-entity.js'
import {
  MINE_ACTION_TICKS,
  ROOT_GROUP_ID,
} from './const.js'
import {
  countInventory,
  decrementRecipe,
  incrementItem,
  inventoryAdd,
  inventorySub,
} from './inventory.js'
import {
  ActionType,
  AssemblerRecipeItemType,
  BurnerMiningDrillEntity,
  CraftAction,
  EntityId,
  EntityType,
  FurnaceRecipeItemType,
  ItemType,
  MineAction,
  ResourceType,
  StoneFurnaceEntity,
  World,
} from './world.js'

export interface IContext {
  world: World
  addItemToInventory(itemType: ItemType): void
  craftEntity(entityType: EntityType): void
  destroyEntity(entityId: EntityId): void
  setAssemblerRecipe(
    id: EntityId,
    recipeItemType: AssemblerRecipeItemType | null,
  ): void
  mineResource(resourceType: ResourceType): void
  buildStoneFurnace(
    recipeItemType: FurnaceRecipeItemType,
  ): void
  destroyStoneFurnace(
    recipeItemType: FurnaceRecipeItemType,
  ): void
  buildBurnerMiningDrill(resourceType: ResourceType): void
  destroyBurnerMiningDrill(resourceType: ResourceType): void
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
    craftEntity(entityType) {
      const recipe = world.entityRecipes[entityType]
      invariant(recipe)
      decrementRecipe(world, recipe)

      invariant(Object.keys(recipe.output).length === 1)
      invariant(recipe.output[entityType] === 1)

      const action: CraftAction = {
        type: ActionType.enum.Craft,
        itemType: entityType,
        ticksRemaining: recipe.ticks,
      }

      world.actionQueue.push(action)

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
    destroyEntity(entityId) {
      invariant(world.entities[entityId])
      delete world.entities[entityId]
      setWorld({ ...world })
    },
    mineResource(resourceType) {
      const tail = world.actionQueue.at(-1)
      if (
        tail?.type === ActionType.enum.Mine &&
        tail.resourceType === resourceType
      ) {
        tail.ticksRequested += MINE_ACTION_TICKS
      } else {
        const action: MineAction = {
          type: ActionType.enum.Mine,
          resourceType,
          ticksRequested: MINE_ACTION_TICKS,
          ticksActive: 0,
        }
        world.actionQueue.push(action)
      }

      setWorld({ ...world })
    },
    buildStoneFurnace(recipeItemType) {
      const entityType = EntityType.enum.StoneFurnace
      const inInventory = countInventory(
        world.inventory,
        entityType,
      )
      invariant(inInventory >= 1)
      inventorySub(world.inventory, entityType, 1)

      const entity = buildStoneFurance(
        world,
        ROOT_GROUP_ID,
        recipeItemType,
      )
      invariant(!world.entities[entity.id])
      world.entities[entity.id] = entity

      setWorld({ ...world })
    },
    destroyStoneFurnace(recipeItemType) {
      let found: StoneFurnaceEntity | null = null
      for (const entity of Object.values(world.entities)) {
        if (
          entity.type === EntityType.enum.StoneFurnace &&
          entity.recipeItemType === recipeItemType
        ) {
          found = entity
          break
        }
      }

      invariant(found)
      delete world.entities[found.id]

      inventoryAdd(
        world.inventory,
        EntityType.enum.StoneFurnace,
        1,
      )

      setWorld({ ...world })
    },
    buildBurnerMiningDrill(resourceType) {
      const entityType = EntityType.enum.BurnerMiningDrill
      const inInventory = countInventory(
        world.inventory,
        entityType,
      )
      invariant(inInventory >= 1)
      inventorySub(world.inventory, entityType, 1)

      const entity = buildBurnerMiningDrill(
        world,
        ROOT_GROUP_ID,
        resourceType,
      )
      invariant(!world.entities[entity.id])
      world.entities[entity.id] = entity

      setWorld({ ...world })
    },
    destroyBurnerMiningDrill(resourceType) {
      let found: BurnerMiningDrillEntity | null = null
      for (const entity of Object.values(world.entities)) {
        if (
          entity.type ===
            EntityType.enum.BurnerMiningDrill &&
          entity.resourceType === resourceType
        ) {
          found = entity
          break
        }
      }

      invariant(found)
      delete world.entities[found.id]

      inventoryAdd(
        world.inventory,
        EntityType.enum.BurnerMiningDrill,
        1,
      )

      setWorld({ ...world })
    },
  }
  return context
}
