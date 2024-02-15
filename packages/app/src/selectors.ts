import { createSelector } from '@reduxjs/toolkit'
import invariant from 'tiny-invariant'
import { RootState } from './store.js'
import {
  BufferEntity,
  EntityId,
  EntityType,
  GroupId,
} from './world.js'

export const selectEntity = createSelector(
  [
    (state: RootState) => state.world.entities,
    (_state: RootState, entityId: EntityId) => entityId,
  ],
  (entities, entityId) => {
    const entity = entities[entityId]
    invariant(entity)
    return entity
  },
)

export const selectBuffers = createSelector(
  [
    (state: RootState) => state.world.entities,
    (state: RootState, groupId: GroupId) => {
      const group = state.world.groups[groupId]
      invariant(group)
      return group.entityIds
    },
  ],
  (entities, entityIds) => {
    return Object.values(entities).filter(
      (entity): entity is BufferEntity =>
        entityIds[entity.id] === true &&
        entity.type === EntityType.enum.Buffer,
    )
  },
)
