import { useContext, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import invariant from 'tiny-invariant'
import { GroupView } from '../components/group-view.js'
import { Context, GroupContext } from '../context.js'
import { Block, BlockId, Group, World } from '../world.js'

export function GroupPage() {
  const { world } = useContext(Context)
  const block = useBlock(world)
  const group = useGroup(world, block)

  if (!(block && group)) {
    return null
  }

  return (
    <GroupContext.Provider value={{ block, group }}>
      <GroupView />
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
