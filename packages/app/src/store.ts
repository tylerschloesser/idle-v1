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
  initialEntityMetrics,
} from './generate-world.js'
import { tickWorld } from './tick-world.js'
import { iterateBlockItems } from './util.js'
import { fastForward, saveWorld } from './world-api.js'
import {
  AssemblerRecipeItemType,
  BaseEntity,
  BlockId,
  CombustionMinerEntity,
  CombustionSmelterEntity,
  Entity,
  EntityCardState,
  EntityId,
  EntityType,
  GeneratorEntity,
  HandMinerEntity,
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

export type HandMinerConfig = Pick<
  HandMinerEntity,
  'type' | 'queue' | 'scale'
>

export type HandAssemblerConfig = Pick<
  HandMinerEntity,
  'type' | 'queue' | 'scale'
>

export type CombustionSmelterConfig = Pick<
  CombustionSmelterEntity,
  'type' | 'recipeItemType' | 'fuelType' | 'scale'
>

export type CombustionMinerConfig = Pick<
  CombustionMinerEntity,
  'type' | 'resourceType' | 'fuelType' | 'scale'
>

export type GeneratorConfig = Pick<
  GeneratorEntity,
  'type' | 'scale'
>

export type EntityConfig =
  | HandMinerConfig
  | CombustionSmelterConfig
  | CombustionMinerConfig
  | GeneratorConfig

export const buildEntity = createAction<{
  blockId: BlockId
  config: EntityConfig
}>('build-entity')

export const updateEntity = createAction<{
  entityId: EntityId
  config: EntityConfig
}>('update-entity')

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

            const block = world.blocks[entity.blockId]
            invariant(block)

            for (const [key, value] of Object.entries(
              block.items,
            )) {
              if (entity.type === key && value.count >= 1) {
                entity.scale += 1
                value.count -= 1
                return
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

            const block = world.blocks[entity.blockId]
            invariant(block)

            let item = block.items[entity.type]
            if (!item) {
              item = block.items[entity.type] = {
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
            const { blockId, config } = action.payload
            let remaining = config.scale

            const block = world.blocks[blockId]
            invariant(block)

            for (const [
              itemType,
              item,
            ] of iterateBlockItems(block)) {
              if (itemType !== config.type) {
                continue
              }
              const scale = Math.min(
                Math.floor(item.count),
                remaining,
              )
              invariant(isInteger(scale))
              if (scale) {
                item.count -= scale
                remaining -= scale
              }
            }

            invariant(remaining === 0)

            const common: BaseEntity = {
              id: `${world.nextEntityId++}`,
              blockId,
              condition: 1,
              scale: config.scale,
              cardState: initialCardState(),
            }

            let entity: Entity
            switch (config.type) {
              case EntityType.enum.HandMiner:
              case EntityType.enum.CombustionMiner:
              case EntityType.enum.CombustionSmelter:
              case EntityType.enum.Generator: {
                entity = {
                  ...common,
                  ...config,
                }
                break
              }
              default: {
                invariant(false, 'TODO')
              }
            }

            invariant(!world.entities[entity.id])
            world.entities[entity.id] = entity

            invariant(!block.entityIds[entity.id])
            block.entityIds[entity.id] = true

            invariant(!world.metrics[entity.id])
            world.metrics[entity.id] =
              initialEntityMetrics()
          },
        )

        builder.addCase(
          destroyEntity,
          ({ world }, action) => {
            const { entityId } = action.payload

            const entity = world.entities[entityId]
            invariant(entity)

            const block = world.blocks[entity.blockId]
            invariant(block)

            let item = block.items[entity.type]
            if (!item) {
              item = block.items[entity.type] = {
                condition: 1,
                count: 0,
              }
            }
            item.count += entity.scale

            invariant(block.entityIds[entity.id] === true)
            delete block.entityIds[entity.id]

            delete world.entities[entity.id]

            delete world.metrics[entity.id]
          },
        )

        builder.addCase(appHidden.fulfilled, (state) => {
          state.tickIntervalId = null
        })

        builder.addCase(
          updateEntity,
          ({ world }, action) => {
            const { entityId, config } = action.payload

            const entity = world.entities[entityId]
            invariant(entity)

            switch (entity.type) {
              case EntityType.enum.HandMiner:
              case EntityType.enum.HandAssembler:
              case EntityType.enum.CombustionSmelter:
              case EntityType.enum.CombustionMiner: {
                invariant(entity.type === config.type)
                world.entities[entityId] = {
                  ...entity,
                  ...config,
                }
                break
              }
              default: {
                invariant(false, 'TODO')
              }
            }
          },
        )
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
