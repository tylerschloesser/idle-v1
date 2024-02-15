import { createContext } from 'react'
import invariant from 'tiny-invariant'
import {
  AssemblerRecipeItemType,
  BlockId,
  EntityCardState,
  EntityId,
  EntityType,
  GroupId,
  ResourceType,
  World,
} from './world.js'

export interface IWorldContext {}

export interface IWorldContextV0 {
  world: World
  enqueueHandMineOperation(
    entityId: EntityId,
    resourceType: ResourceType,
  ): void
  setEntityCardState(
    entityId: EntityId,
    cardState: EntityCardState,
  ): void
  enqueueHandAssembleOperation(
    entityId: EntityId,
    entityType: AssemblerRecipeItemType,
  ): void
  cancelHandAssembleOperation(
    entityId: EntityId,
    itemId: string,
  ): void

  incrementEntityScale(entityId: EntityId): void
}

export const WorldContext = createContext<IWorldContext>(
  null!,
)

export function buildWorldContext(
  world: World,
  setWorld: (cb: (world: World) => World) => void,
): IWorldContext {
  return {}
}

export function buildWorldContextV0(
  world: World,
  setWorld: (cb: (world: World) => World) => void,
): IWorldContextV0 {
  const context: IWorldContextV0 = {
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
    setEntityCardState(
      entityId,
      cardState: EntityCardState,
    ) {
      setWorld((prev) => {
        const entity = world.entities[entityId]
        invariant(entity)
        entity.cardState = cardState
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
    incrementEntityScale(entityId) {
      const entity = world.entities[entityId]
      invariant(entity)
      const group = world.groups[entity.groupId]
      invariant(group)

      for (const peerId of Object.keys(group.entityIds)) {
        const peer = world.entities[peerId]
        invariant(peer)
        if (peer.type !== EntityType.enum.Buffer) continue

        for (const [key, value] of Object.entries(
          peer.contents,
        )) {
          if (entity.type === key && value.count >= 1) {
            entity.scale += 1
            value.count -= 1
            return
          }
        }
      }

      invariant(false)
    },
  }
  return context
}

export interface IGroupContext {
  blockId: BlockId
  groupId: GroupId
}

export const GroupContext = createContext<IGroupContext>(
  null!,
)
