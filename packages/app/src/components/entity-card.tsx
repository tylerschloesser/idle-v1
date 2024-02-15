import {
  faGear,
  faMinus,
  faPlus,
} from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { EntityId, createSelector } from '@reduxjs/toolkit'
import { AnimatePresence, motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import invariant from 'tiny-invariant'
import { ItemIcon } from '../icon.component.js'
import { ITEM_TYPE_TO_LABEL } from '../item-label.component.js'
import {
  AppDispatch,
  RootState,
  setEntityCardState,
} from '../store.js'
import { Text } from '../text.component.js'
import {
  Entity,
  EntityCardState,
  EntityType,
} from '../world.js'
import { BufferEntityCard } from './buffer-entity-card.js'
import styles from './entity-card.module.scss'
import { HandAssemblerEntityCard } from './hand-assembler-entity-card.js'
import { HandMinerEntityCard } from './hand-miner-entity-card.js'

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

export function EntityCard({ entityId }: EntityCardProps) {
  const dispatch = useDispatch<AppDispatch>()

  const entity = useSelector((state: RootState) =>
    selectEntity(state, entityId),
  )

  const visible =
    entity.cardState !== EntityCardState.enum.Hidden
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
                    cardState: visible
                      ? EntityCardState.enum.Hidden
                      : EntityCardState.enum.Visible,
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
