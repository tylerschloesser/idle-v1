import { useContext } from 'react'
import invariant from 'tiny-invariant'
import {
  ActiveEntity,
  BuildView,
  BuildViewProps,
} from '../components/build-view.js'
import { GroupContext, useWorld } from '../context.js'
import {
  BufferEntity,
  EntityType,
  Group,
  ItemType,
  World,
} from '../world.js'

export function BuildPage() {
  const entities = useActiveEntities()
  const availableEntityTypes = useAvailableEntityTypes()
  return (
    <BuildView
      entities={entities}
      availableEntityTypes={availableEntityTypes}
    />
  )
}

function* iterateBufferEntities(
  world: World,
  group: Group,
): Generator<BufferEntity> {
  for (const entityId of Object.keys(group.entityIds)) {
    const entity = world.entities[entityId]
    invariant(entity)
    if (entity.type !== EntityType.enum.Buffer) continue
    yield entity
  }
}

function* iterateBufferContents(
  entity: BufferEntity,
): Generator<[ItemType, number]> {
  for (const [key, value] of Object.entries(
    entity.contents,
  )) {
    const itemType = ItemType.parse(key)
    yield [itemType, value.count]
  }
}

function useActiveEntities(): ActiveEntity[] {
  const world = useWorld()
  const { group } = useContext(GroupContext)

  const available: Partial<Record<EntityType, number>> = {}

  for (const entity of iterateBufferEntities(
    world,
    group,
  )) {
    for (const [itemType, count] of iterateBufferContents(
      entity,
    )) {
      if (isEntityType(itemType) && count >= 1) {
        available[itemType] =
          (available[itemType] ?? 0) + Math.floor(count)
      }
    }
  }

  return Object.keys(group.entityIds).map((entityId) => {
    const entity = world.entities[entityId]
    invariant(entity)
    return {
      id: entity.id,
      type: entity.type,
      scale: entity.scale,
      available: available[entity.type] ?? 0,
    }
  })
}

function isEntityType(
  itemType: ItemType,
): itemType is EntityType {
  return EntityType.safeParse(itemType).success
}

function useAvailableEntityTypes(): BuildViewProps['availableEntityTypes'] {
  // prettier-ignore
  const availableEntityTypes: BuildViewProps['availableEntityTypes'] = {}

  const world = useWorld()
  const { group } = useContext(GroupContext)

  for (const entity of iterateBufferEntities(
    world,
    group,
  )) {
    for (const [itemType, count] of iterateBufferContents(
      entity,
    )) {
      if (isEntityType(itemType) && count >= 1) {
        availableEntityTypes[itemType] =
          (availableEntityTypes[itemType] ?? 0) + 1
      }
    }
  }

  return availableEntityTypes
}
