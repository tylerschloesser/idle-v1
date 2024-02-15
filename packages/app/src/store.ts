import {
  configureStore,
  createAction,
  createAsyncThunk,
  createReducer,
  createSelector,
} from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import invariant from 'tiny-invariant'
import { TICK_RATE } from './const.js'
import { tickWorld } from './tick-world.js'
import { fastForward, saveWorld } from './world-api.js'
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

export type RootState = {
  tickIntervalId: number | null
  world: World
}

export const appVisible = createAsyncThunk<
  null | number,
  void,
  {
    state: RootState
  }
>('app-visible', async (_, thunkApi) => {
  const state = thunkApi.getState()

  if (state.tickIntervalId !== null) {
    return null
  }
  return self.setInterval(() => {
    thunkApi.dispatch(tick({ tickCount: 1 }))

    saveWorld(thunkApi.getState().world)
  }, TICK_RATE)
})

export const appHidden = createAsyncThunk<
  void,
  void,
  {
    state: RootState
  }
>('app-hidden', async (_, thunkApi) => {
  self.clearInterval(
    thunkApi.getState().tickIntervalId ?? undefined,
  )
})

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
          ({ world }, action) => {
            const { entityId, entityType } = action.payload

            const entity = world.entities[entityId]
            invariant(
              entity?.type ===
                EntityType.enum.HandAssembler,
            )

            const tail = entity.queue.at(-1)
            if (tail?.recipeItemType === entityType) {
              tail.count += 1
            } else {
              entity.queue.push({
                id: self.crypto.randomUUID(),
                count: 1,
                recipeItemType: entityType,
                ticks: 0,
              })
            }
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

        builder.addCase(
          cancelHandAssembleOperation,
          ({ world }, action) => {
            const { entityId, itemId } = action.payload
            const entity = world.entities[entityId]
            invariant(
              entity?.type ===
                EntityType.enum.HandAssembler,
            )

            const index = entity.queue.findIndex(
              (item) => item.id === itemId,
            )
            invariant(index >= 0)

            entity.queue.splice(index, 1)
          },
        )

        builder.addCase(
          incrementEntityScale,
          ({ world }, action) => {
            const { entityId } = action.payload

            const entity = world.entities[entityId]
            invariant(entity)
            const group = world.groups[entity.groupId]
            invariant(group)

            for (const peerId of Object.keys(
              group.entityIds,
            )) {
              const peer = world.entities[peerId]
              invariant(peer)
              if (peer.type !== EntityType.enum.Buffer)
                continue

              for (const [key, value] of Object.entries(
                peer.contents,
              )) {
                if (
                  entity.type === key &&
                  value.count >= 1
                ) {
                  entity.scale += 1
                  value.count -= 1
                  return
                }
              }
            }

            invariant(false)
          },
        )

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

const selectWorldId = createSelector(
  [(state: RootState) => state.world],
  (world) => world.id,
)

export function useWorldId(): string {
  return useSelector(selectWorldId)
}
