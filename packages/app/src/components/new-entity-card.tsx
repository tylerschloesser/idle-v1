import { EntityType } from '../world.js'
import styles from './new-entity-card.module.scss'

export interface NewEntityCardProps {
  availableEntityTypes: Partial<Record<EntityType, number>>
}

export function NewEntityCard({
  availableEntityTypes,
}: NewEntityCardProps) {
  return (
    <div className={styles['new-entity-card']}>
      {mapAvailableEntityTypes(
        availableEntityTypes,
        (entityType, count) => (
          <div key={entityType}>
            {entityType}: {count}
          </div>
        ),
      )}
    </div>
  )
}

function mapAvailableEntityTypes(
  availableEntityTypes: NewEntityCardProps['availableEntityTypes'],
  cb: (
    entityType: EntityType,
    count: number,
  ) => JSX.Element,
): JSX.Element[] {
  return Object.entries(availableEntityTypes).map(
    ([key, value]) => {
      const entityType = EntityType.parse(key)
      return cb(entityType, value)
    },
  )
}
