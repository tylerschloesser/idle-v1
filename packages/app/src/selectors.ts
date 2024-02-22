import { createSelector } from '@reduxjs/toolkit'
import invariant from 'tiny-invariant'
import { RootState } from './store.js'
import { EntityId } from './world.js'

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
