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

        entity.queue.push({
          count: 1,
          resourceType,
          ticks: 10,
        })

        return { ...prev }
      })
    },
  }
  return context
}
