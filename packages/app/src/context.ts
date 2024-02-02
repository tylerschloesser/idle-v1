import {
  Dispatch,
  SetStateAction,
  createContext,
} from 'react'
import invariant from 'tiny-invariant'
import { MINE_ACTION_TICKS } from './const.js'
import {
  inventoryAdd,
  inventoryGet,
  inventorySub,
  inventorySubRecipe,
} from './inventory.js'
import { getGroup } from './util.js'
import {
  ActionType,
  CraftAction,
  Entity,
  EntityType,
  MineAction,
  ResourceType,
  World,
} from './world.js'

export interface IContext {
  world: World
  craftEntity(entityType: EntityType): void
  destroyEntity(entity: Entity): void
  mineResource(resourceType: ResourceType): void
  buildEntity(entity: Entity): void
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
      inventorySubRecipe(world.inventory, recipe)

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
    destroyEntity(entity) {
      const group = getGroup(world, entity)
      inventoryAdd(
        world.inventory,
        entity.type,
        1,
        group.condition,
      )

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
    buildEntity(entity) {
      const value = inventoryGet(
        world.inventory,
        entity.type,
      )
      invariant(value.count >= 1)
      inventorySub(world.inventory, entity.type, 1)

      const group = getGroup(world, entity)

      group.condition =
        (group.condition * group.count) /
          (group.count + 1) +
        value.condition / (group.count + 1)

      group.count += 1

      setWorld({ ...world })
    },
  }
  return context
}
