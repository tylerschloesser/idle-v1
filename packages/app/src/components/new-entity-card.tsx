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
import { EntityType, ResourceType } from '../world.js'
import styles from './new-entity-card.module.scss'

export interface NewEntityCardProps {
  availableEntityTypes: Partial<Record<EntityType, number>>
}

function mapResourceTypes(
  cb: (resourceType: ResourceType) => JSX.Element,
): JSX.Element[] {
  return Object.values(ResourceType.Values).map(
    (resourceType) => cb(resourceType),
  )
}

export function NewCombustionSmelter() {
  const [selectedResourceType, setSelectedResourceType] =
    useSearchParamsState<ResourceType>(
      'new-combustion-smelter',
      'selected-resource-type',
      (value) => ResourceType.parse(value),
    )

  return (
    <>
      <div className={styles['resource-option-group']}>
        {mapResourceTypes((type) => (
          <div
            key={type}
            className={styles['resource-option']}
            onClick={() => {
              setSelectedResourceType(type)
            }}
          >
            <ItemIcon type={type} />
            <Text>{ITEM_TYPE_TO_LABEL[type]}</Text>
          </div>
        ))}
      </div>
      <div>
        selected resource type: {selectedResourceType}
      </div>
    </>
  )
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

function useSearchParamsState<T extends string>(
  namespace: string,
  key: string,
  parser: (value: string) => T,
): [T | null, Dispatch<SetStateAction<T | null>>] {
  const name = `${namespace}.${key}`

  const [searchParams, setSearchParams] = useSearchParams()
  const [state, setState] = useState<T | null>(
    (() => {
      const value = searchParams.get(name)
      if (value === null) return value
      return parser(value)
    })(),
  )

  useEffect(() => {
    if (searchParams.get(name) !== state) {
      setSearchParams(
        (prev) => {
          console.log('updating search param for', name)
          if (state === null) {
            prev.delete(name)
          } else {
            prev.set(name, state)
          }
          return prev
        },
        { replace: true },
      )
    }
  }, [state, searchParams])

  useEffect(() => {
    return () => {
      console.log('cleaning up search param?', name)
      setSearchParams(
        (prev) => {
          // TODO this doesn't seem to be working?
          prev.delete(name)
          return prev
        },
        { replace: true },
      )
    }
  }, [])

  return [state, setState]
}

function useSelectedEntityType(
  availableEntityTypes: NewEntityCardProps['availableEntityTypes'],
): [
  EntityType | null,
  Dispatch<SetStateAction<EntityType | null>>,
] {
  const [selectedEntityType, setSelectedEntityType] =
    useSearchParamsState(
      'new-entity-card',
      'selected-entity-type',
      (value) => EntityType.parse(value),
    )

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
