import { useContext, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { GroupContext } from './context.js'
import { selectBuffers } from './selectors.js'
import {
  AppDispatch,
  EntityConfig,
  RootState,
  buildEntity,
} from './store.js'
import {
  isEntityType,
  iterateBufferContents,
} from './util.js'
import { EntityType, GroupId } from './world.js'

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
