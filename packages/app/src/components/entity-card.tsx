import {
  faEye,
  faEyeSlash,
  faGear,
} from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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
      <div className={styles['card-header']}>
        <span>
          <ItemIcon type={entity.type} />{' '}
          <Text bold>
            {[ITEM_TYPE_TO_LABEL[entity.type]]} {'#1'}
          </Text>
        </span>
        <div className={styles['toggle-group']}>
          <button className={styles.toggle}>
            <FontAwesomeIcon icon={faGear} />
          </button>
          <button
            className={styles.toggle}
            onClick={() => {
              setEntityVisible(entity.id, !entity.visible)
            }}
          >
            <FontAwesomeIcon
              icon={entity.visible ? faEye : faEyeSlash}
            />
          </button>
        </div>
      </div>
      {entity.visible && !empty && (
        <div className={styles['card-content']}>
          {children}
        </div>
      )}
    </div>
  )
}
