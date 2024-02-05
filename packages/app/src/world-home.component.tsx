import {
  useBlockId,
  useGroupId,
} from './world-home.hooks.js'

export function WorldHome() {
  const blockId = useBlockId()
  const groupId = useGroupId(blockId)

  if (!blockId || !groupId) {
    return null
  }
  return (
    <>
      {blockId}-{groupId}
    </>
  )
}
