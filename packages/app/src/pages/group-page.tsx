import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import {
  Outlet,
  useNavigate,
  useParams,
} from 'react-router-dom'
import invariant from 'tiny-invariant'
import { GroupContext } from '../context.js'
import { RootState } from '../store.js'
import { Block, BlockId, Group, World } from '../world.js'

export function GroupPage() {
  const world = useSelector(
    (state: RootState) => state.world,
  )
  const block = useBlock(world)
  const group = useGroup(world, block)

  if (!(block && group)) {
    return null
  }

  return (
    <GroupContext.Provider
      value={{ blockId: block.id, groupId: group.id }}
    >
      <Outlet />
    </GroupContext.Provider>
  )
}

function useBlock(world: World): Block | null {
  let { blockId } = useParams<{
    blockId: BlockId
  }>()
  invariant(blockId)
  blockId = BlockId.parse(blockId)

  const block = world.blocks[blockId]
  return block ?? null
}

function useGroup(
  world: World,
  block: Block | null,
): Group | null {
  const { groupId } = useParams<{ groupId: string }>()
  const navigate = useNavigate()

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
        `/world/${world.id}/block/${block.id}/group/${defaultGroupId}`,
        { replace: true },
      )
    } else if (!world.groups[groupId]) {
      navigate(
        `/world/${world.id}/block/${block.id}/group`,
        { replace: true },
      )
    }
  }, [groupId, block, world])

  if (!groupId) {
    return null
  }

  const group = world.groups[groupId]
  return group ?? null
}
