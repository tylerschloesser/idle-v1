import { createContext } from 'react'
import invariant from 'tiny-invariant'
import {
  EntityId,
  EntityType,
  ResourceType,
  World,
} from './world.js'

export interface IContext {
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
    entityType: EntityType,
  ): void
}

export const Context = createContext<IContext>(null!)

export function buildContext(
  world: World,
  setWorld: (cb: (world: World) => World) => void,
): IContext {
  const context: IContext = {
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
    enqueueHandAssembleOperation() {},
  }
  return context
}
