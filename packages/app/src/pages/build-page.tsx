import { useContext } from 'react'
import invariant from 'tiny-invariant'
import {
  ActiveEntity,
  BuildView,
} from '../components/build-view.js'
import { GroupContext, useWorld } from '../context.js'
import { EntityType, ItemType } from '../world.js'

export function BuildPage() {
  const entities = useActiveEntities()
  return <BuildView entities={entities} />
}

function useActiveEntities(): ActiveEntity[] {
  const world = useWorld()
  const { group } = useContext(GroupContext)

  const available: Partial<Record<EntityType, number>> = {}
  for (const entityId of Object.keys(group.entityIds)) {
    const entity = world.entities[entityId]
    invariant(entity)

    if (entity.type !== EntityType.enum.Buffer) continue

    for (const [key, value] of Object.entries(
      entity.contents,
    )) {
      const itemType = ItemType.parse(key)
      if (isEntityType(itemType) && value.count >= 1) {
        available[itemType] = (available[itemType] ?? 0) + 1
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
