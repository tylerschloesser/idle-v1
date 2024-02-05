import { useContext, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import invariant from 'tiny-invariant'
import { Context } from './context.js'
import { BlockId, GroupId } from './world.js'

export function useBlockId(): BlockId | null {
  const { world } = useContext(Context)
  const [search, setSearch] = useSearchParams()
  const blockId = search.get('blockId')

  useEffect(() => {
    if (blockId === null || !world.blocks[blockId]) {
      const defaultBlockId = Object.keys(world.blocks).at(0)
      invariant(defaultBlockId)
      setSearch((next) => {
        next.set('blockId', defaultBlockId)
        return next
      })
    }
  }, [blockId])

  return blockId ? BlockId.parse(blockId) : null
}

export function useGroupId(
  blockId: BlockId | null,
): GroupId | null {
  const { world } = useContext(Context)
  const [search, setSearch] = useSearchParams()
  const groupId = search.get('groupId')

  useEffect(() => {
    const block = blockId
      ? world.blocks?.[blockId]
      : undefined
    if (block === undefined) {
      // should be updated in the block effect
      return
    }

    if (groupId === null || !block.groupIds[groupId]) {
      const defaultGroupId = Object.keys(block.groupIds).at(
        0,
      )
      invariant(defaultGroupId)
      setSearch((next) => {
        next.set('groupId', defaultGroupId)
        return next
      })
    }
  }, [blockId, groupId])

  return groupId ? GroupId.parse(groupId) : null
}
