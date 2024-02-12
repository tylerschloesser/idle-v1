import {
  faGear,
  faMinus,
  faPlus,
} from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AnimatePresence, motion } from 'framer-motion'
import { useContext } from 'react'
import { WorldContext } from '../context.js'
import { ItemIcon } from '../icon.component.js'
import { ITEM_TYPE_TO_LABEL } from '../item-label.component.js'
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
  const { setEntityCardState } = useContext(WorldContext)

  const visible =
    entity.cardState !== EntityCardState.enum.Hidden
  return (
    <div className={styles['card']}>
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
              setEntityCardState(
                entity.id,
                visible
                  ? EntityCardState.enum.Hidden
                  : EntityCardState.enum.Visible,
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
      <AnimatePresence initial={false}>
        {visible && (
          <motion.div
            className={styles['card-content']}
            initial={{ height: 0, opacity: 0.5 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0.5 }}
          >
            <div className={styles['card-content-inner']}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
