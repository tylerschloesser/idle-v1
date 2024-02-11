import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button } from '../button.component.js'
import { ItemIcon } from '../icon.component.js'
import { ITEM_TYPE_TO_LABEL } from '../item-label.component.js'
import { Text } from '../text.component.js'
import { EntityType } from '../world.js'
import styles from './new-entity-card.module.scss'

export interface NewEntityCardProps {
  availableEntityTypes: Partial<Record<EntityType, number>>
}

function useSelectedEntityType(
  availableEntityTypes: NewEntityCardProps['availableEntityTypes'],
): EntityType | null {
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedEntityType, setSelectedEntityType] =
    useState<EntityType | null>(null)

  useEffect(() => {
    if (searchParams.has('selected-entity-type')) {
      setSelectedEntityType(
        EntityType.parse(
          searchParams.get('selected-entity-type'),
        ),
      )
    } else {
      setSelectedEntityType(null)
    }
  }, [searchParams])

  useEffect(() => {
    setSearchParams((prev) => {
      if (selectedEntityType === null) {
        prev.delete('selected-entity-type')
      } else {
        prev.set('selected-entity-type', selectedEntityType)
      }
      return prev
    })
  }, [selectedEntityType])

  return selectedEntityType
}

export function NewEntityCard({
  availableEntityTypes,
}: NewEntityCardProps) {
  const selectedEntityType = useSelectedEntityType(
    availableEntityTypes,
  )
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
      <div>selected: {selectedEntityType}</div>
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
