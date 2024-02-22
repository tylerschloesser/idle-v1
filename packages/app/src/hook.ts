import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useBlock } from './context.js'
import {
  AppDispatch,
  CombustionMinerConfig,
  CombustionSmelterConfig,
  EntityConfig,
  GeneratorConfig,
  HandAssemblerConfig,
  HandMinerConfig,
  buildEntity,
  decrementEntityScale,
  destroyEntity,
  incrementEntityScale,
  updateEntity,
} from './store.js'
import { isEntityType, iterateBlockItems } from './util.js'
import {
  Block,
  CombustionMinerEntity,
  CombustionSmelterEntity,
  EntityType,
  GeneratorEntity,
  HandAssemblerEntity,
  HandMinerEntity,
} from './world.js'

export function useAvailableEntityTypes(
  block: Block,
): Partial<Record<EntityType, number>> {
  const available: Partial<Record<EntityType, number>> = {}
  for (const [itemType, count] of iterateBlockItems(
    block,
  )) {
    if (!isEntityType(itemType) || count < 1) {
      continue
    }
    available[itemType] =
      (available[itemType] ?? 0) + Math.floor(count)
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
  const block = useBlock()
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
        blockId: block.id,
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
  [EntityType.enum.HandAssembler]: {
    Entity: HandAssemblerEntity
    Config: HandAssemblerConfig
  }
  [EntityType.enum.CombustionSmelter]: {
    Entity: CombustionSmelterEntity
    Config: CombustionSmelterConfig
  }
  [EntityType.enum.CombustionMiner]: {
    Entity: CombustionMinerEntity
    Config: CombustionMinerConfig
  }
  [EntityType.enum.Generator]: {
    Entity: GeneratorEntity
    Config: GeneratorConfig
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
