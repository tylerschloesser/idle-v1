import { useContext, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import invariant from 'tiny-invariant'
import { Context } from '../context.js'
import { BlockId, GroupId } from '../world.js'

function useGroupId() {
  const { blockId, groupId } = useParams<{
    blockId: BlockId
    groupId: GroupId
  }>()
  invariant(blockId)

  const navigate = useNavigate()
  const { world } = useContext(Context)

  useEffect(() => {
    const block = world.blocks[blockId]

    if (!block) {
      navigate(`/world/${world.id}/block`, {
        replace: true,
      })
    } else if (!groupId) {
      const defaultGroupId = Object.keys(block.groupIds).at(
        0,
      )
      invariant(defaultGroupId)
      navigate(
        `/world/${world.id}/block/${blockId}/group/${defaultGroupId}`,
        { replace: true },
      )
    } else if (!world.groups[groupId]) {
      navigate(`/world/${world.id}/block/${blockId}/group`)
    }
  }, [groupId, blockId, world])

  if (!groupId) {
    return null
  }
  return GroupId.parse(groupId)
}

export function GroupPage() {
  const groupId = useGroupId()
  return <>TODO group page {groupId}</>
}
