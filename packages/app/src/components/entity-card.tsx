import {
  faGear,
  faMinus,
  faPlus,
} from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AnimatePresence, motion } from 'framer-motion'
import { useContext } from 'react'
import { Context } from '../context.js'
import { ItemIcon } from '../icon.component.js'
import { ITEM_TYPE_TO_LABEL } from '../item-label.component.js'
import { Text } from '../text.component.js'
import { Entity } from '../world.js'
import styles from './entity-card.module.scss'

export type EntityCardProps<T> = React.PropsWithChildren<{
  entity: T
  empty?: boolean
}>

export function EntityCard({
  entity,
  empty = false,
  children,
}: EntityCardProps<Entity>) {
  const { setEntityVisible } = useContext(Context)
  return (
    <div className={styles['card']}>
      <div
        className={styles['card-header']}
        onClick={() => {
          if (entity.visible === false) {
            setEntityVisible(entity.id, true)
          }
        }}
      >
        <span>
          <ItemIcon type={entity.type} />{' '}
          <Text bold>
            {ITEM_TYPE_TO_LABEL[entity.type]} {'#1'}
          </Text>
        </span>
        <div className={styles['toggle-group']}>
          <button className={styles.toggle}>
            <FontAwesomeIcon icon={faGear} fixedWidth />
          </button>
          <button
            className={styles.toggle}
            onClick={() => {
              setEntityVisible(entity.id, !entity.visible)
            }}
          >
            <FontAwesomeIcon
              icon={entity.visible ? faMinus : faPlus}
              fixedWidth
            />
          </button>
        </div>
      </div>
      <AnimatePresence initial={false}>
        {entity.visible && !empty && (
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
