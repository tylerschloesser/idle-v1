import {
  configureStore,
  createAction,
  createAsyncThunk,
  createReducer,
} from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import invariant from 'tiny-invariant'
import { TICK_RATE } from './const.js'
import { tickWorld } from './tick-world.js'
import { fastForward } from './world-api.js'
import {
  AssemblerRecipeItemType,
  EntityCardState,
  EntityId,
  EntityType,
  ResourceType,
  World,
} from './world.js'

export const tick = createAction<{ tickCount: number }>(
  'tick',
)
// prettier-ignore
export type RootState = {
  tickIntervalId: number | null
  world: World
}

export const appVisible = createAsyncThunk<null | number>(
  'app-visible',
  async (_, thunkApi) => {
    const state = thunkApi.getState() as RootState

    if (state.tickIntervalId !== null) {
      return null
    }
    return self.setInterval(() => {
      thunkApi.dispatch(tick({ tickCount: 1 }))
    }, TICK_RATE)
  },
)

export const appHidden = createAsyncThunk(
  'app-hidden',
  async (_, thunkApi) => {
    const state = thunkApi.getState() as RootState
    self.clearInterval(state.tickIntervalId ?? undefined)
  },
)

export const enqueueHandMineOperation = createAction<{
  entityId: EntityId
  resourceType: ResourceType
}>('enqueue-hand-mine-operation')

export const setEntityCardState = createAction<{
  entityId: EntityId
  cardState: EntityCardState
}>('set-entity-card-state')

export const enqueueHandAssembleOperation = createAction<{
  entityId: EntityId
  entityType: AssemblerRecipeItemType
}>('enqueue-hand-assemble-operation')

export const cancelHandAssembleOperation = createAction<{
  entityId: EntityId
  itemId: string
}>('cancel-hand-assemble-operation')

export const incrementEntityScale = createAction<{
  entityId: EntityId
}>('increment-entity-scale')

export const createStore = (world: World) =>
  configureStore<RootState>({
    reducer: createReducer(
      { tickIntervalId: null as number | null, world },
      (builder) => {
        builder.addCase(
          enqueueHandMineOperation,
          ({ world }, action) => {
            const { entityId, resourceType } =
              action.payload

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

        builder.addCase(tick, (state) => {
          tickWorld(state.world)
        })

        builder.addCase(appVisible.pending, (state) => {
          fastForward(state.world)
        })

        builder.addCase(
          appVisible.fulfilled,
          (state, action) => {
            if (action.payload !== null) {
              state.tickIntervalId = action.payload
            }
          },
        )

        builder.addCase(
          enqueueHandAssembleOperation,
          () => {
            // TODO
          },
        )

        builder.addCase(
          setEntityCardState,
          ({ world }, action) => {
            const { entityId, cardState } = action.payload
            const entity = world.entities[entityId]
            invariant(entity)
            entity.cardState = cardState
          },
        )

        builder.addCase(cancelHandAssembleOperation, () => {
          // TODO
        })

        builder.addCase(incrementEntityScale, () => {
          // TODO
        })

        builder.addCase(appHidden.fulfilled, (state) => {
          state.tickIntervalId = null
        })
      },
    ),
    devTools: {
      actionsDenylist: ['tick'],
    },
  })

// prettier-ignore
export type AppDispatch = ReturnType<typeof createStore >['dispatch']

export function useWorld(): World {
  return useSelector((state: RootState) => state.world)
}
