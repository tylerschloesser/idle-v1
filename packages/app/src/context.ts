import {
  Dispatch,
  SetStateAction,
  createContext,
} from 'react'
import invariant from 'tiny-invariant'
import { MINE_ACTION_TICKS } from './const.js'
import {
  countInventory,
  inventoryAdd,
  inventorySub,
  inventorySubRecipe,
} from './inventory.js'
import {
  ActionType,
  BuildEntity,
  Condition,
  CraftAction,
  Entity,
  EntityId,
  EntityType,
  MineAction,
  ResourceType,
  World,
} from './world.js'

export interface IContext {
  world: World
  craftEntity(entityType: EntityType): void
  destroyEntity(entityId: EntityId): void
  mineResource(resourceType: ResourceType): void
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
    destroyEntity(entityId) {
      const entity = world.entities[entityId]
      invariant(entity)
      delete world.entities[entityId]

      inventoryAdd(
        world.inventory,
        entity.type,
        1,
        entity.condition,
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
    buildEntity(build) {
      const inInventory = countInventory(
        world.inventory,
        build.type,
      )
      invariant(inInventory >= 1)

      const condition = Condition.parse(
        world.inventory[build.type]?.condition,
      )

      inventorySub(world.inventory, build.type, 1)

      const entity: Entity = {
        ...build,
        id: `${world.nextEntityId++}`,
        condition,
      }
      invariant(!world.entities[entity.id])
      world.entities[entity.id] = entity

      setWorld({ ...world })
    },
  }
  return context
}
