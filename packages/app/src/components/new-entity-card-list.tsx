import { Fragment, useContext } from 'react'
import { GroupContext } from '../context.js'
import { useAvailableEntityTypes } from '../hook.js'
import { EntityType } from '../world.js'

function mapAvailable(
  available: ReturnType<typeof useAvailableEntityTypes>,
  cb: (
    entityType: EntityType,
    count: number,
  ) => JSX.Element,
): JSX.Element[] {
  return Object.entries(available).map(([key, value]) => (
    <Fragment key={key}>
      {cb(EntityType.parse(key), value)}
    </Fragment>
  ))
}

export function NewEntityCardList() {
  const { groupId } = useContext(GroupContext)
  const available = useAvailableEntityTypes(groupId)

  return mapAvailable(available, (entityType, count) => (
    <>
      TODO {entityType}: {count}
    </>
  ))
}
