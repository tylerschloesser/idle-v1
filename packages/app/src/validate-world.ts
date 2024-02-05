import invariant from 'tiny-invariant'
import { EntityId, GroupId, World } from './world.js'

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

function validateGroups(world: World): boolean {
  const seen = new Set<EntityId>()

  for (const [groupId, group] of Object.entries(
    world.groups,
  )) {
    invariant(groupId === group.id)

    const block = world.blocks[group.blockId]
    invariant(block?.groupIds[groupId] === true)

    for (const entityId of Object.keys(group.entityIds)) {
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

    const group = world.groups[entity.groupId]
    invariant(group?.entityIds[entityId] === true)

    for (const inputEntityId of Object.keys(entity.input)) {
      const inputEntity = world.entities[inputEntityId]
      invariant(inputEntity?.output[entityId] === true)
    }

    for (const outputEntityId of Object.keys(
      entity.output,
    )) {
      const outputEntity = world.entities[outputEntityId]
      invariant(outputEntity?.input[entityId] === true)
    }
  }
  return true
}

export function validateWorld(world: World): boolean {
  validateBlocks(world)
  validateGroups(world)
  validateEntities(world)
  return true
}
