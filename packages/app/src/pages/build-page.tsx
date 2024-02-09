import { useContext } from 'react'
import invariant from 'tiny-invariant'
import { BuildView } from '../components/build-view.js'
import { GroupContext, useWorld } from '../context.js'
import { Entity } from '../world.js'

export function BuildPage() {
  const entities = useEntities()
  return <BuildView entities={entities} />
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
