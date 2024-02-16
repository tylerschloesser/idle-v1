import { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectBuffers } from './selectors.js'
import { RootState } from './store.js'
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
