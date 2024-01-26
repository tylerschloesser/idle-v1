import { useParams } from 'react-router-dom'
import invariant from 'tiny-invariant'
import { Heading3 } from './heading.component.js'
import { WorldMap } from './world-map.component.js'
import { EntityId } from './world.js'

export function WorldEntity() {
  const { entityId } = useParams<{ entityId: EntityId }>()
  invariant(entityId)
  return (
    <>
      <WorldMap />
      <Heading3>Entity (#{entityId})</Heading3>
    </>
  )
}
