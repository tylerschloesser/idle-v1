import { createSelector } from '@reduxjs/toolkit'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import {
  Outlet,
  useNavigate,
  useParams,
} from 'react-router-dom'
import invariant from 'tiny-invariant'
import { GroupContext } from '../context.js'
import { RootState, useWorldId } from '../store.js'
import { Block, BlockId, Group, GroupId } from '../world.js'

const selectBlock = createSelector(
  [
    (state: RootState) => state.world.blocks,
    (_state: RootState, blockId: BlockId | null) => blockId,
  ],
  (blocks, blockId) =>
    (blockId ? blocks[blockId] : null) ?? null,
)

const selectGroup = createSelector(
  [
    (state: RootState) => state.world.groups,
    (_state: RootState, groupId: GroupId | null) => groupId,
  ],
  (groups, groupId) => {
    if (!groupId) return null
    return groups[groupId] ?? null
  },
)

export function GroupPage() {
  const block = useBlock()
  const group = useGroup(block)

  if (!(block && group)) {
    return null
  }

  console.log('blockId', block.id, 'groupId', group.id)

  return (
    <GroupContext.Provider
      value={{ blockId: block.id, groupId: group.id }}
    >
      <Outlet />
    </GroupContext.Provider>
  )
}

function useBlock(): Block | null {
  let { blockId } = useParams<{
    blockId: BlockId
  }>()
  invariant(blockId)
  blockId = BlockId.parse(blockId)

  const block = useSelector((state: RootState) =>
    selectBlock(state, blockId ?? null),
  )
  return block
}

function useGroup(block: Block | null): Group | null {
  const worldId = useWorldId()
  const { groupId } = useParams<{ groupId: string }>()
  const navigate = useNavigate()

  const group = useSelector((state: RootState) =>
    selectGroup(state, groupId ?? null),
  )

  useEffect(() => {
    if (!block) {
      // redirect to a valid block should happen within the block page
      return
    }

    if (!groupId) {
      const defaultGroupId = Object.keys(block.groupIds).at(
        0,
      )
      invariant(defaultGroupId)
      navigate(
        `/world/${worldId}/block/${block.id}/group/${defaultGroupId}`,
        { replace: true },
      )
    } else if (!group) {
      navigate(
        `/world/${worldId}/block/${block.id}/group`,
        { replace: true },
      )
    }
  }, [groupId, block, worldId])

  if (!groupId) {
    return null
  }

  return group ?? null
}
