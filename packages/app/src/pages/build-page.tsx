import { useContext } from 'react'
import invariant from 'tiny-invariant'
import { GroupContext, useWorld } from '../context.js'
import { ITEM_TYPE_TO_LABEL } from '../item-label.component.js'
import { Entity } from '../world.js'

export function BuildPage() {
  const entities = useEntities()

  return (
    <>
      {entities.map((entity) => (
        <div key={entity.id}>
          {ITEM_TYPE_TO_LABEL[entity.type]} #1
        </div>
      ))}
    </>
  )
}

function useEntities(): Entity[] {
  const world = useWorld()
  const { group } = useContext(GroupContext)

  return Object.keys(group.entityIds).map((entityId) => {
    const entity = world.entities[entityId]
    invariant(entity)
    return entity
  })
}
