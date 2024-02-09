import { createContext, useContext } from 'react'
import invariant from 'tiny-invariant'
import {
  AssemblerRecipeItemType,
  Block,
  EntityId,
  EntityType,
  Group,
  ResourceType,
  World,
} from './world.js'

export interface IWorldContext {
  world: World
  enqueueHandMineOperation(
    entityId: EntityId,
    resourceType: ResourceType,
  ): void
  setEntityVisible(
    entityId: EntityId,
    visible: boolean,
  ): void
  enqueueHandAssembleOperation(
    entityId: EntityId,
    entityType: AssemblerRecipeItemType,
  ): void
  cancelHandAssembleOperation(
    entityId: EntityId,
    itemId: string,
  ): void
}

export const WorldContext = createContext<IWorldContext>(
  null!,
)

export function useWorld(): World {
  const { world } = useContext(WorldContext)
  return world
}

export function buildWorldContext(
  world: World,
  setWorld: (cb: (world: World) => World) => void,
): IWorldContext {
  const context: IWorldContext = {
    world,
    enqueueHandMineOperation(
      entityId: EntityId,
      resourceType,
    ) {
      setWorld((prev) => {
        const entity = world.entities[entityId]
        invariant(
          entity?.type === EntityType.enum.HandMiner,
        )

        const tail = entity.queue.at(-1)
        if (tail?.resourceType === resourceType) {
          tail.count += 1
        } else {
          entity.queue.push({
            id: self.crypto.randomUUID(),
            count: 1,
            resourceType,
            ticks: 0,
          })
        }

        return { ...prev }
      })
    },
    setEntityVisible(entityId, visible) {
      setWorld((prev) => {
        const entity = world.entities[entityId]
        invariant(entity)
        entity.visible = visible
        return { ...prev }
      })
    },
    enqueueHandAssembleOperation(entityId, recipeItemType) {
      setWorld((prev) => {
        const entity = world.entities[entityId]
        invariant(
          entity?.type === EntityType.enum.HandAssembler,
        )

        const tail = entity.queue.at(-1)
        if (tail?.recipeItemType === recipeItemType) {
          tail.count += 1
        } else {
          entity.queue.push({
            id: self.crypto.randomUUID(),
            count: 1,
            recipeItemType,
            ticks: 0,
          })
        }

        return { ...prev }
      })
    },
    cancelHandAssembleOperation(entityId, itemId) {
      setWorld((prev) => {
        const entity = world.entities[entityId]
        invariant(
          entity?.type === EntityType.enum.HandAssembler,
        )

        const index = entity.queue.findIndex(
          (item) => item.id === itemId,
        )
        invariant(index >= 0)

        entity.queue.splice(index, 1)

        return { ...prev }
      })
    },
  }
  return context
}

export interface IGroupContext {
  block: Block
  group: Group
}

export const GroupContext = createContext<IGroupContext>(
  null!,
)
