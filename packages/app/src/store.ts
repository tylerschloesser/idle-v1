import {
  configureStore,
  createAction,
  createReducer,
} from '@reduxjs/toolkit'
import invariant from 'tiny-invariant'
import { fastForward } from './world-api.js'
import {
  EntityId,
  EntityType,
  ResourceType,
  World,
} from './world.js'

export const appVisible = createAction('app-visible')
export const appHidden = createAction('app-hidden')

export const tick = createAction<{ tickCount: number }>(
  'tick',
)

export const enqueueHandMineOperation = createAction<{
  entityId: EntityId
  resourceType: ResourceType
}>('enqueue-hand-mine-operation')

export const createStore = (world: World) =>
  configureStore({
    reducer: createReducer(world, (builder) => {
      builder.addCase(
        enqueueHandMineOperation,
        (world, action) => {
          const { entityId, resourceType } = action.payload

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
        },
      )

      builder.addCase(tick, (world, action) => {
        const { tickCount } = action.payload
        console.log('todo tick world')
      })
      builder.addCase(appVisible, (world) => {
        fastForward(world)
        // TODO start ticker
      })
      builder.addCase(appHidden, (world) => {})
    }),
  })

// prettier-ignore
export type RootState = ReturnType<ReturnType<typeof createStore>['getState']>
// prettier-ignore
export type AppDispatch = ReturnType<typeof createStore >['dispatch']
