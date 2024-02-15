import {
  faGear,
  faMinus,
  faPlus,
} from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { EntityId, createSelector } from '@reduxjs/toolkit'
import { AnimatePresence, motion } from 'framer-motion'
import { useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import invariant from 'tiny-invariant'
import { GroupContext } from '../context.js'
import { ItemIcon } from '../icon.component.js'
import { ITEM_TYPE_TO_LABEL } from '../item-label.component.js'
import {
  AppDispatch,
  RootState,
  incrementEntityScale,
  setEntityCardState,
} from '../store.js'
import { Text } from '../text.component.js'
import {
  BufferEntity,
  Entity,
  EntityType,
  GroupId,
} from '../world.js'
import { BufferEntityCard } from './buffer-entity-card.js'
import styles from './entity-card.module.scss'
import { HandAssemblerEntityCard } from './hand-assembler-entity-card.js'
import { HandMinerEntityCard } from './hand-miner-entity-card.js'
import { ModifyScale } from './modify-scale.js'

export interface EntityCardProps {
  entityId: EntityId
}

const selectEntity = createSelector(
  [
    (state: RootState) => state.world.entities,
    (_state: RootState, entityId: EntityId) => entityId,
  ],
  (entities, entityId) => {
    const entity = entities[entityId]
    invariant(entity)
    return entity
  },
)

const selectBuffers = createSelector(
  [
    (state: RootState) => state.world.entities,
    (state: RootState, groupId: GroupId) => {
      const group = state.world.groups[groupId]
      invariant(group)
      return group.entityIds
    },
  ],
  (entities, entityIds) => {
    return Object.values(entities).filter(
      (entity): entity is BufferEntity =>
        entityIds[entity.id] === true &&
        entity.type === EntityType.enum.Buffer,
    )
  },
)

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
          <div className={styles['toggle-group']}>
            <button className={styles.toggle}>
              <FontAwesomeIcon icon={faGear} fixedWidth />
            </button>
            <button
              className={styles.toggle}
              onClick={() => {
                dispatch(
                  setEntityCardState({
                    entityId: entity.id,
                    cardState: {
                      ...entity.cardState,
                      visible: !visible,
                    },
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
          {visible && (
            <motion.div
              key={`${entity.id}.content`}
              className={styles['card-content']}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className={styles['card-content-inner']}>
                <ModifyScale
                  available={available}
                  scale={entity.scale}
                  decrement={() => {
                    // TODO
                  }}
                  increment={() => {
                    dispatch(
                      incrementEntityScale({
                        entityId: entity.id,
                      }),
                    )
                  }}
                />
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
    default:
      return <>TODO {entity.type}</>
  }
}
