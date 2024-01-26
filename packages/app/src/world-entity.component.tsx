import { useParams } from 'react-router-dom'
import invariant from 'tiny-invariant'
import { EntityId } from './world.js'

export function WorldEntity() {
  const { entityId } = useParams<{ entityId: EntityId }>()
  invariant(entityId)
  return <>TODO: {entityId}</>
}
