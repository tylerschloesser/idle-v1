import {
  faArrowTurnLeft,
  faGear,
  faMinus,
  faPlus,
} from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AnimatePresence, motion } from 'framer-motion'
import { useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { GroupContext } from '../context.js'
import { ItemIcon } from '../icon.component.js'
import { ITEM_TYPE_TO_LABEL } from '../item-label.component.js'
import {
  selectBuffers,
  selectEntity,
} from '../selectors.js'
import {
  AppDispatch,
  RootState,
  decrementEntityScale,
  destroyEntity,
  incrementEntityScale,
  setEntityCardState,
} from '../store.js'
import { Text } from '../text.component.js'
import { Entity, EntityId, EntityType } from '../world.js'
import { BufferEntityCard } from './buffer-entity-card.js'
import {
  EditCombustionSmelter,
  ViewCombustionSmelter,
} from './combustion-smelter.js'
import styles from './entity-card.module.scss'
import { HandAssemblerEntityCard } from './hand-assembler-entity-card.js'
import {
  EditHandMiner,
  HandMinerEntityCard,
} from './hand-miner-entity-card.js'

export interface EntityCardProps {
  entityId: EntityId
}

function useAvailable(entityType: EntityType) {
  const { groupId } = useContext(GroupContext)
  const buffers = useSelector((state: RootState) =>
    selectBuffers(state, groupId),
  )

  let available = 0
  for (const buffer of buffers) {
    available += buffer.contents[entityType]?.count ?? 0
  }
  return Math.floor(available)
}

export function EntityCard({ entityId }: EntityCardProps) {
  const dispatch = useDispatch<AppDispatch>()

  const entity = useSelector((state: RootState) =>
    selectEntity(state, entityId),
  )

  const available = useAvailable(entity.type)

  const { visible, edit } = entity.cardState

  return (
    <motion.div layout className={styles['card']}>
      <motion.div
        layout="position"
        className={styles['card-inner']}
      >
        <div className={styles['card-header']}>
          <span>
            <ItemIcon type={entity.type} />{' '}
            <Text bold>
              {ITEM_TYPE_TO_LABEL[entity.type]} {'#1'}
            </Text>
            <Text gray>{` [${entity.scale}]`}</Text>
          </span>
          <div className={styles['card-toggle-group']}>
            <AnimatePresence
              initial={false}
              onExitComplete={() => {
                if (edit) {
                  dispatch(
                    setEntityCardState({
                      entityId,
                      cardState: { edit: false },
                    }),
                  )
                }
              }}
            >
              {visible && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={styles['card-toggle']}
                  onClick={() => {
                    dispatch(
                      setEntityCardState({
                        entityId,
                        cardState: { edit: !edit },
                      }),
                    )
                  }}
                >
                  <FontAwesomeIcon
                    icon={edit ? faArrowTurnLeft : faGear}
                    fixedWidth
                  />
                </motion.button>
              )}
            </AnimatePresence>
            <button
              className={styles['card-toggle']}
              onClick={() => {
                dispatch(
                  setEntityCardState({
                    entityId,
                    cardState: { visible: !visible },
                  }),
                )
              }}
            >
              <FontAwesomeIcon
                icon={visible ? faMinus : faPlus}
                fixedWidth
              />
            </button>
          </div>
        </div>
        <AnimatePresence initial={false} mode="popLayout">
          {visible && edit && (
            <motion.div
              key={`${entity.id}.edit`}
              className={styles['card-content']}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className={styles['card-content-inner']}>
                {renderEdit(entity, available)}
              </div>
            </motion.div>
          )}
          {visible && !edit && (
            <motion.div
              key={`${entity.id}.content`}
              className={styles['card-content']}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className={styles['card-content-inner']}>
                {renderContent(entity)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

function renderContent(entity: Entity) {
  switch (entity.type) {
    case EntityType.enum.HandMiner:
      return <HandMinerEntityCard entity={entity} />
    case EntityType.enum.HandAssembler:
      return <HandAssemblerEntityCard entity={entity} />
    case EntityType.enum.Buffer:
      return <BufferEntityCard entity={entity} />
    case EntityType.enum.CombustionSmelter:
      return <ViewCombustionSmelter entity={entity} />
    default:
      return <>TODO {entity.type} content</>
  }
}

function useIncrementScale({
  entityId,
  available,
}: {
  entityId: EntityId
  available: number
}) {
  const dispatch = useDispatch<AppDispatch>()
  if (available) {
    return () => {
      dispatch(incrementEntityScale({ entityId }))
    }
  }
}

function useDecrementScale({
  entityId,
  scale,
}: {
  entityId: EntityId
  scale: number
}) {
  const dispatch = useDispatch<AppDispatch>()
  if (scale === 0) {
    return
  }
  if (scale === 1) {
    return () => {
      if (window.confirm('Destroy this entity?')) {
        dispatch(destroyEntity({ entityId }))
      }
    }
  }
  return () => {
    dispatch(decrementEntityScale({ entityId }))
  }
}

function renderEdit(entity: Entity, available: number) {
  const { id: entityId, scale } = entity
  const incrementScale = useIncrementScale({
    entityId,
    available,
  })
  const decrementScale = useDecrementScale({
    entityId,
    scale,
  })

  switch (entity.type) {
    case EntityType.enum.HandMiner:
      return (
        <EditHandMiner
          scale={entity.scale}
          incrementScale={incrementScale}
          decrementScale={decrementScale}
        />
      )
    case EntityType.enum.CombustionSmelter:
      return (
        <EditCombustionSmelter
          scale={entity.scale}
          incrementScale={incrementScale}
          decrementScale={decrementScale}
          selectedRecipeItemType={entity.recipeItemType}
        />
      )
    default:
      return <>TODO {entity.type} edit</>
  }
}
