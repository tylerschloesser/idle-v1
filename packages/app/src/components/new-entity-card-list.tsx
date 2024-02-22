import { useBlock } from '../context.js'
import { useAvailableEntityTypes } from '../hook.js'
import { EntityType } from '../world.js'
import { NewEntityCard } from './new-entity-card.js'

function mapAvailable(
  available: ReturnType<typeof useAvailableEntityTypes>,
  cb: (
    entityType: EntityType,
    count: number,
  ) => JSX.Element,
): JSX.Element[] {
  return Object.entries(available).map(([key, value]) =>
    cb(EntityType.parse(key), value),
  )
}

export function NewEntityCardList() {
  const block = useBlock()
  const available = useAvailableEntityTypes(block)

  return mapAvailable(available, (entityType, count) => (
    <NewEntityCard
      key={entityType}
      entityType={entityType}
      available={count}
    />
  ))
}
