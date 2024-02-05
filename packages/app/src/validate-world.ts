import invariant from 'tiny-invariant'
import { GroupId, World } from './world.js'

function validateBlocks(world: World): boolean {
  const seen = new Set<GroupId>()
  for (const [blockId, block] of Object.entries(
    world.blocks,
  )) {
    invariant(blockId === block.id)
    for (const groupId of Object.keys(block.groupIds)) {
      invariant(!seen.has(groupId))
      seen.add(groupId)
    }
  }
  return true
}

export function validateWorld(world: World): boolean {
  validateBlocks(world)
  return true
}
