import { useContext } from 'react'
import { useSelector } from 'react-redux'
import { GroupContext } from '../context.js'
import { selectBuffers } from '../selectors.js'
import { RootState } from '../store.js'
import {
  isEntityType,
  iterateBufferContents,
} from '../util.js'
import { EntityType } from '../world.js'

export function NewEntityCardList() {
  const { groupId } = useContext(GroupContext)
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

  return <>{JSON.stringify(available)}</>
}
