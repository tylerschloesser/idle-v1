import {
  configureStore,
  createAction,
  createAsyncThunk,
  createReducer,
  createSelector,
} from '@reduxjs/toolkit'
import { isInteger } from 'lodash-es'
import { useSelector } from 'react-redux'
import invariant from 'tiny-invariant'
import { TICK_RATE } from './const.js'
import {
  initialCardState,
  initialMetrics,
} from './generate-world.js'
import { tickWorld } from './tick-world.js'
import {
  getBuffers,
  iterateBufferContents,
} from './util.js'
import { fastForward, saveWorld } from './world-api.js'
import {
  AssemblerRecipeItemType,
  Entity,
  EntityCardState,
  EntityId,
  EntityType,
  GroupId,
  ItemType,
  ResourceType,
  SmelterRecipeItemType,
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
  cardState: Partial<EntityCardState>
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

export const decrementEntityScale = createAction<{
  entityId: EntityId
}>('decrement-entity-scale')

export const buildEntity = createAction<{
  entityType: EntityType
  groupId: GroupId
  scale: number
}>('build-entity')

export const destroyEntity = createAction<{
  entityId: EntityId
}>('destroy-entity')

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
            entity.cardState = {
              ...entity.cardState,
              ...cardState,
            }
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

            const buffers = getBuffers(
              world.entities,
              group,
            )

            for (const buffer of buffers) {
              for (const [key, value] of Object.entries(
                buffer.contents,
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

        builder.addCase(
          decrementEntityScale,
          ({ world }, action) => {
            const { entityId } = action.payload

            const entity = world.entities[entityId]
            invariant(entity)

            invariant(entity.scale > 1)

            const group = world.groups[entity.groupId]
            invariant(group)

            const buffers = getBuffers(
              world.entities,
              group,
            )

            invariant(buffers.length === 1, 'TODO')
            const buffer = buffers.at(0)!

            let item = buffer.contents[entity.type]
            if (!item) {
              item = buffer.contents[entity.type] = {
                condition: 1,
                count: 0,
              }
            }

            item.count += 1

            entity.scale -= 1
          },
        )

        builder.addCase(
          buildEntity,
          ({ world }, action) => {
            const { entityType, groupId } = action.payload

            let remaining = action.payload.scale

            const group = world.groups[groupId]
            invariant(group)

            const buffers = getBuffers(
              world.entities,
              group,
            )

            for (const buffer of buffers) {
              for (const [
                itemType,
                count,
              ] of iterateBufferContents(buffer)) {
                if (itemType !== entityType) {
                  continue
                }
                const scale = Math.min(
                  Math.floor(count),
                  remaining,
                )
                invariant(isInteger(scale))
                if (scale) {
                  buffer.contents[itemType]!.count -= scale
                  remaining -= scale
                }
              }
            }

            invariant(remaining === 0)

            let entity: Entity
            switch (entityType) {
              case EntityType.enum.CombustionSmelter: {
                entity = {
                  id: `${world.nextEntityId++}`,
                  condition: 1,
                  groupId,
                  input: {},
                  output: {},
                  scale: action.payload.scale,
                  fuelType: ItemType.enum.Coal,
                  recipeItemType:
                    SmelterRecipeItemType.enum.IronPlate,
                  type: entityType,
                  cardState: initialCardState(),
                  metrics: initialMetrics(),
                }
                break
              }
              default: {
                invariant(false, 'TODO')
              }
            }

            invariant(!world.entities[entity.id])
            world.entities[entity.id] = entity

            {
              invariant(buffers.length === 1)
              const buffer = buffers.at(0)
              invariant(buffer)

              // connect first buffer -> entity
              buffer.output[entity.id] = true
              entity.input[buffer.id] = true

              // connect entity -> first buffer
              entity.output[buffer.id] = true
              buffer.input[entity.id] = true
            }

            invariant(!group.entityIds[entity.id])
            group.entityIds[entity.id] = true
          },
        )

        builder.addCase(
          destroyEntity,
          ({ world }, action) => {
            const { entityId } = action.payload

            const entity = world.entities[entityId]
            invariant(entity)

            // TODO
            invariant(
              entity.type !== EntityType.enum.Buffer,
            )

            const group = world.groups[entity.groupId]
            invariant(group)

            const buffers = getBuffers(
              world.entities,
              group,
            )
            invariant(buffers.length === 1, 'TODO')
            const buffer = buffers.at(0)!

            {
              let item = buffer.contents[entity.type]
              if (!item) {
                item = buffer.contents[entity.type] = {
                  condition: 1,
                  count: 0,
                }
              }
              item.count += entity.scale
            }

            for (const key of Object.keys(entity.output)) {
              const peerId = EntityId.parse(key)
              const peer = world.entities[peerId]
              invariant(peer)

              invariant(peer.input[entity.id] === true)
              delete peer.input[entity.id]
            }

            for (const key of Object.keys(entity.input)) {
              const peerId = EntityId.parse(key)
              const peer = world.entities[peerId]
              invariant(peer)

              invariant(peer.output[entity.id] === true)
              delete peer.output[entity.id]
            }

            invariant(group.entityIds[entity.id] === true)
            delete group.entityIds[entity.id]
            // TODO hand last entity in group?

            delete world.entities[entity.id]
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
