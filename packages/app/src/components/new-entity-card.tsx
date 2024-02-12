import classNames from 'classnames'
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react'
import { useSearchParams } from 'react-router-dom'
import invariant from 'tiny-invariant'
import * as z from 'zod'
import { Button } from '../button.component.js'
import { ItemIcon } from '../icon.component.js'
import { ITEM_TYPE_TO_LABEL } from '../item-label.component.js'
import { Text } from '../text.component.js'
import { EntityType, ResourceType } from '../world.js'
import styles from './new-entity-card.module.scss'

const KEY = 'new-entity-card-state'

export interface NewEntityCardProps {
  availableEntityTypes: Partial<Record<EntityType, number>>
}

const CombustionSmelterState = z.strictObject({
  selectedEntityType: z.literal(
    EntityType.enum.CombustionSmelter,
  ),
  resourceType: ResourceType.nullable(),
})
type CombustionSmelterState = z.infer<
  typeof CombustionSmelterState
>

const HandMinerState = z.strictObject({
  selectedEntityType: z.literal(EntityType.enum.HandMiner),
})
type HandMinerState = z.infer<typeof HandMinerState>

const EmptyState = z.strictObject({
  selectedEntityType: z.null(),
})
type EmptyState = z.infer<typeof EmptyState>

const State = z.discriminatedUnion('selectedEntityType', [
  EmptyState,
  HandMinerState,
  CombustionSmelterState,
])
type State = z.infer<typeof State>

type SetStateFn = Dispatch<SetStateAction<State>>

function mapResourceTypes(
  cb: (resourceType: ResourceType) => JSX.Element,
): JSX.Element[] {
  return Object.values(ResourceType.Values).map(
    (resourceType) => cb(resourceType),
  )
}

interface NewCombustionSmelterProps {
  state: CombustionSmelterState
  setState: SetStateFn
}

export function NewCombustionSmelter({
  state,
  setState,
}: NewCombustionSmelterProps) {
  return (
    <>
      <div className={styles['resource-option-group']}>
        {mapResourceTypes((type) => (
          <div
            key={type}
            className={classNames(
              styles['resource-option'],
              {
                [styles['resource-option--inactive']!]:
                  state.resourceType &&
                  state.resourceType !== type,
              },
            )}
            onClick={() => {
              setState({
                ...state,
                resourceType: type,
              })
            }}
          >
            <ItemIcon type={type} />
            <Text>{ITEM_TYPE_TO_LABEL[type]}</Text>
          </div>
        ))}
      </div>
      <div>
        selected resource type: {state.resourceType}
      </div>
    </>
  )
}

export function NewEntityCard({
  availableEntityTypes,
}: NewEntityCardProps) {
  const [state, setState] = useSearchParamsState()

  useEffect(() => {
    if (
      state.selectedEntityType &&
      !availableEntityTypes[state.selectedEntityType]
    ) {
      setState({ selectedEntityType: null })
    }
  }, [state, availableEntityTypes])

  if (
    state.selectedEntityType &&
    !availableEntityTypes[state.selectedEntityType]
  ) {
    return null
  }

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
                switch (entityType) {
                  case EntityType.enum.HandMiner: {
                    setState({
                      selectedEntityType:
                        EntityType.enum.HandMiner,
                    })
                    break
                  }
                  case EntityType.enum.CombustionSmelter: {
                    setState({
                      selectedEntityType:
                        EntityType.enum.CombustionSmelter,
                      resourceType: null,
                    })
                    break
                  }
                  default:
                    invariant(false)
                }
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
        switch (state.selectedEntityType) {
          case EntityType.enum.CombustionSmelter:
            return (
              <NewCombustionSmelter
                state={state}
                setState={setState}
              />
            )
          default:
            return <>TODO {state.selectedEntityType}</>
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

const initialSearchParamsState: State = (() => {
  const params = new URLSearchParams(window.location.search)
  const value = params.get(KEY)
  if (!value) return { selectedEntityType: null }
  const state = State.safeParse(JSON.parse(value))
  if (!state.success) {
    console.error(`Failed to parse ${KEY}`, state.error)
    return { selectedEntityType: null }
  }
  return state.data
})()

function useSearchParamsState(): [
  State,
  Dispatch<SetStateAction<State>>,
] {
  const [searchParams, setSearchParams] = useSearchParams()
  const [state, setState] = useState<State>(
    initialSearchParamsState,
  )

  useEffect(() => {
    if (state === null) {
      if (searchParams.has(KEY)) {
        searchParams.delete(KEY)
        setSearchParams(searchParams, { replace: true })
      }
    } else {
      const json = JSON.stringify(state)
      if (searchParams.get(KEY) !== json) {
        searchParams.set(KEY, json)
        setSearchParams(searchParams, { replace: true })
      }
    }
  }, [state, searchParams])

  useEffect(() => {
    return () => {
      searchParams.delete(KEY)
      setSearchParams(searchParams, { replace: true })
    }
  }, [])

  return [state, setState]
}
