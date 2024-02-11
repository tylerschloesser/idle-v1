import { Button } from '../button.component.js'
import { ItemIcon } from '../icon.component.js'
import {
  ITEM_TYPE_TO_LABEL,
  ItemLabel,
} from '../item-label.component.js'
import { Text } from '../text.component.js'
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
      <div className={styles['entity-option-group']}>
        {mapAvailableEntityTypes(
          availableEntityTypes,
          (entityType, count) => (
            <div
              className={styles['entity-option']}
              key={entityType}
            >
              <div>
                <ItemIcon type={entityType} />
                <Text>
                  {ITEM_TYPE_TO_LABEL[entityType]}
                </Text>
              </div>
              <Text>{count} Available</Text>
            </div>
          ),
        )}
      </div>
      <Button onClick={() => {}}>Build</Button>
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
