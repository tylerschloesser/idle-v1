import {
  faEye,
  faEyeSlash,
  faGear,
} from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useContext } from 'react'
import { Context } from './context.js'
import styles from './entity-card.module.scss'
import { ItemIcon } from './icon.component.js'
import { ITEM_TYPE_TO_LABEL } from './item-label.component.js'
import { Text } from './text.component.js'
import { Entity } from './world.js'

export type EntityCardProps<T> = React.PropsWithChildren<{
  entity: T
}>

export function EntityCard({
  entity,
  children,
}: EntityCardProps<Entity>) {
  const { setEntityVisible } = useContext(Context)
  return (
    <div className={styles['card']}>
      <div className={styles['card-header']}>
        <span>
          <ItemIcon type={entity.type} />{' '}
          <Text bold>
            {[ITEM_TYPE_TO_LABEL[entity.type]]}
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
      {entity.visible && (
        <div className={styles['card-content']}>
          {children}
        </div>
      )}
    </div>
  )
}
