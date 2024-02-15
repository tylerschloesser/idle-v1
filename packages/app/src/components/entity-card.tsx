import {
  faGear,
  faMinus,
  faPlus,
} from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AnimatePresence, motion } from 'framer-motion'
import { useDispatch } from 'react-redux'
import { ItemIcon } from '../icon.component.js'
import { ITEM_TYPE_TO_LABEL } from '../item-label.component.js'
import {
  AppDispatch,
  setEntityCardState,
} from '../store.js'
import { Text } from '../text.component.js'
import { Entity, EntityCardState } from '../world.js'
import styles from './entity-card.module.scss'

export type EntityCardProps<T> = React.PropsWithChildren<{
  entity: T
}>

export function EntityCard({
  entity,
  children,
}: EntityCardProps<Entity>) {
  const dispatch = useDispatch<AppDispatch>()

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
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
