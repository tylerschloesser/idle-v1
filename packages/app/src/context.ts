import {
  Dispatch,
  SetStateAction,
  createContext,
} from 'react'
import invariant from 'tiny-invariant'
import {
  MINE_ACTION_TICKS,
  ROOT_GROUP_ID,
} from './const.js'
import {
  countInventory,
  decrementRecipe,
  inventoryAdd,
  inventorySub,
} from './inventory.js'
import {
  ActionType,
  AssemblerRecipeItemType,
  BuildEntity,
  BurnerMiningDrillEntity,
  CraftAction,
  Entity,
  EntityId,
  EntityType,
  FurnaceRecipeItemType,
  MineAction,
  ResourceType,
  StoneFurnaceEntity,
  World,
} from './world.js'

export interface IContext {
  world: World
  craftEntity(entityType: EntityType): void
  destroyEntity(entityId: EntityId): void
  setAssemblerRecipe(
    id: EntityId,
    recipeItemType: AssemblerRecipeItemType | null,
  ): void
  mineResource(resourceType: ResourceType): void
  destroyStoneFurnace(
    recipeItemType: FurnaceRecipeItemType,
  ): void
  destroyBurnerMiningDrill(resourceType: ResourceType): void

  buildEntity(build: BuildEntity): void
}

export const Context = createContext<IContext>(null!)

export function buildContext(
  world: World,
  setWorld: Dispatch<SetStateAction<World | null>>,
): IContext {
  const context: IContext = {
    world,
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
      const entity = world.entities[entityId]
      invariant(entity)
      delete world.entities[entityId]

      inventoryAdd(world.inventory, entity.type, 1)

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
    buildEntity(build) {
      const inInventory = countInventory(
        world.inventory,
        build.type,
      )
      invariant(inInventory >= 1)
      inventorySub(world.inventory, build.type, 1)

      const entity: Entity = {
        ...build,
        id: `${world.nextEntityId++}`,
        groupId: ROOT_GROUP_ID,
      }
      invariant(!world.entities[entity.id])
      world.entities[entity.id] = entity

      setWorld({ ...world })
    },
  }
  return context
}
