import { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { GroupContext } from './context.js'
import { selectBuffers } from './selectors.js'
import {
  AppDispatch,
  CombustionMinerConfig,
  CombustionSmelterConfig,
  EntityConfig,
  HandMinerConfig,
  RootState,
  buildEntity,
  decrementEntityScale,
  destroyEntity,
  incrementEntityScale,
  updateEntity,
} from './store.js'
import {
  isEntityType,
  iterateBufferContents,
} from './util.js'
import {
  CombustionMinerEntity,
  CombustionSmelterEntity,
  Entity,
  EntityType,
  GroupId,
  HandMinerEntity,
} from './world.js'

export function useAvailableEntityTypes(
  groupId: GroupId,
): Partial<Record<EntityType, number>> {
  const buffers = useSelector((state: RootState) =>
    selectBuffers(state, groupId),
  )

  const available: Partial<Record<EntityType, number>> = {}
  for (const buffer of buffers) {
    for (const [itemType, count] of iterateBufferContents(
      buffer,
    )) {
      if (!isEntityType(itemType) || count < 1) {
        continue
      }
      available[itemType] =
        (available[itemType] ?? 0) + Math.floor(count)
    }
  }
  return available
}

export function useNewEntityConfig<T extends EntityConfig>(
  initialState: T,
  available: number,
): {
  entity: T
  updateEntity: (update: Partial<T>) => void
  incrementScale?: () => void
  decrementScale?: () => void
  build: () => void
} {
  const dispatch = useDispatch<AppDispatch>()
  const { groupId } = useContext(GroupContext)
  const [entity, setEntity] = useState<T>(initialState)

  const updateEntity: (update: Partial<T>) => void = (
    update,
  ) => {
    setEntity({ ...entity, ...update })
  }

  useEffect(() => {
    if (available < entity.scale) {
      setEntity((prev) => ({
        ...prev,
        scale: available,
      }))
    }
  }, [available])

  const incrementScale =
    available - entity.scale > 0
      ? () => {
          setEntity((prev) => ({
            ...prev,
            scale: prev.scale + 1,
          }))
        }
      : undefined

  const decrementScale =
    entity.scale > 1
      ? () => {
          setEntity((prev) => ({
            ...prev,
            scale: prev.scale - 1,
          }))
        }
      : undefined

  const build: () => void = () => {
    dispatch(
      buildEntity({
        groupId,
        config: entity,
      }),
    )
  }

  return {
    entity,
    updateEntity,
    incrementScale,
    decrementScale,
    build,
  }
}

interface EntityConfigMap {
  [EntityType.enum.HandMiner]: {
    Entity: HandMinerEntity
    Config: HandMinerConfig
  }
  [EntityType.enum.CombustionSmelter]: {
    Entity: CombustionSmelterEntity
    Config: CombustionSmelterConfig
  }
  [EntityType.enum.CombustionMiner]: {
    Entity: CombustionMinerEntity
    Config: CombustionMinerConfig
  }
}

export function useEditEntity<
  K extends keyof EntityConfigMap,
>(entity: EntityConfigMap[K]['Entity'], available: number) {
  const dispatch = useDispatch<AppDispatch>()

  const { id: entityId } = entity

  const incrementScale =
    available > 0
      ? () => {
          dispatch(incrementEntityScale({ entityId }))
        }
      : undefined

  let decrementScale: undefined | (() => void) = undefined

  if (entity.scale > 1) {
    decrementScale = () => {
      dispatch(decrementEntityScale({ entityId }))
    }
  } else if (entity.scale === 1) {
    decrementScale = () => {
      if (window.confirm('Are you sure?')) {
        dispatch(destroyEntity({ entityId }))
      }
    }
  }

  const updateEntityActual: (
    update: Partial<EntityConfigMap[K]['Config']>,
  ) => void = (update) => {
    dispatch(
      updateEntity({
        entityId,
        config: {
          ...entity,
          ...update,
        },
      }),
    )
  }

  return {
    incrementScale,
    decrementScale,
    updateEntity: updateEntityActual,
  }
}
