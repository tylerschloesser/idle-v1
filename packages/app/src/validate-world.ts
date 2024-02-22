import invariant from 'tiny-invariant'
import { EntityId, World } from './world.js'

function validateBlocks(world: World): boolean {
  const seen = new Set<EntityId>()
  for (const [blockId, block] of Object.entries(
    world.blocks,
  )) {
    invariant(blockId === block.id)
    for (const entityId of Object.keys(block.entityIds)) {
      invariant(!seen.has(entityId))
      seen.add(entityId)
    }
  }
  return true
}

function validateEntities(world: World): boolean {
  for (const [entityId, entity] of Object.entries(
    world.entities,
  )) {
    invariant(entityId === entity.id)

    const block = world.blocks[entity.blockId]
    invariant(block?.entityIds[entityId] === true)
  }
  return true
}

export function validateWorld(world: World): boolean {
  validateBlocks(world)
  validateEntities(world)
  return true
}
