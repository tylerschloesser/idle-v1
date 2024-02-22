import { createSelector } from '@reduxjs/toolkit'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import {
  Outlet,
  useNavigate,
  useParams,
} from 'react-router-dom'
import invariant from 'tiny-invariant'
import { RootState, useWorldId } from '../store.js'
import { BlockId } from '../world.js'

function useBlockId(): BlockId | null {
  const { blockId } = useParams<{ blockId: string }>()
  return (blockId && BlockId.parse(blockId)) || null
}

const selectBlock = createSelector(
  [
    (state: RootState) => state.world.blocks,
    (_state: RootState, blockId: BlockId | null) => blockId,
  ],
  (blocks, blockId) => {
    const defaultBlockId = Object.keys(blocks).at(0)
    invariant(defaultBlockId)

    const block = (blockId && blocks[blockId]) || null
    return { defaultBlockId, block }
  },
)

export function BlockPage() {
  const worldId = useWorldId()
  const navigate = useNavigate()
  const blockId = useBlockId()
  const { block, defaultBlockId } = useSelector(
    (state: RootState) => selectBlock(state, blockId),
  )

  useEffect(() => {
    if (!block) {
      navigate(
        `/world/${worldId}/block/${defaultBlockId}`,
        { replace: true },
      )
    }
  }, [block, defaultBlockId])

  if (!block) {
    return null
  }

  return <Outlet />
}
