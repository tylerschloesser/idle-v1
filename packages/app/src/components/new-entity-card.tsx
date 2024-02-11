import {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react'
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

export function NewCombustionSmelter() {
  return <>TODO new combustion smelter</>
}

export function NewEntityCard({
  availableEntityTypes,
}: NewEntityCardProps) {
  const [selectedEntityType, setSelectedEntityType] =
    useSelectedEntityType(availableEntityTypes)
  return (
    <div className={styles['new-entity-card']}>
      <div className={styles['entity-option-group']}>
        {mapAvailableEntityTypes(
          availableEntityTypes,
          (entityType, count) => (
            <div
              className={styles['entity-option']}
              key={entityType}
              onClick={() => {
                setSelectedEntityType(entityType)
              }}
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
      {(() => {
        if (!selectedEntityType) {
          return null
        }
        switch (selectedEntityType) {
          case EntityType.enum.CombustionSmelter:
            return <NewCombustionSmelter />
        }
      })()}
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

function initialSelectedEntityType(
  searchParams: URLSearchParams,
): EntityType | null {
  const value = searchParams.get('selected-entity-type')
  if (!value) {
    return null
  }
  return EntityType.parse(value)
}

function useSelectedEntityType(
  availableEntityTypes: NewEntityCardProps['availableEntityTypes'],
): [
  EntityType | null,
  Dispatch<SetStateAction<EntityType | null>>,
] {
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedEntityType, setSelectedEntityType] =
    useState<EntityType | null>(
      initialSelectedEntityType(searchParams),
    )

  useEffect(() => {
    if (selectedEntityType === null) {
      if (searchParams.has('selected-entity-type')) {
        setSearchParams(
          (prev) => {
            prev.delete('selected-entity-type')
            return prev
          },
          { replace: true },
        )
      }
    } else {
      if (
        searchParams.get('selected-entity-type') !==
        selectedEntityType
      ) {
        setSearchParams(
          (prev) => {
            prev.set(
              'selected-entity-type',
              selectedEntityType,
            )
            return prev
          },
          { replace: true },
        )
      }
    }
  }, [searchParams, selectedEntityType])

  useEffect(() => {
    if (
      selectedEntityType &&
      !availableEntityTypes[selectedEntityType]
    ) {
      setSelectedEntityType(null)
    }
  }, [selectedEntityType, availableEntityTypes])

  return [
    selectedEntityType &&
    availableEntityTypes[selectedEntityType]
      ? selectedEntityType
      : null,

    setSelectedEntityType,
  ]
}
