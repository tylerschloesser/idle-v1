import {
  faMinus,
  faPlus,
} from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { EntityConfig } from '../store.js'
import { Entity } from '../world.js'
import styles from './modify-scale.module.scss'

export interface ModifyScaleProps {
  entity: Pick<Entity, 'scale'>
  available: number
  updateEntity: (
    config: Pick<EntityConfig, 'scale'>,
  ) => void
}

export function ModifyScale({
  entity,
  available,
  updateEntity,
}: ModifyScaleProps) {
  const decrement =
    entity.scale > 1
      ? () => {
          updateEntity({ scale: entity.scale - 1 })
        }
      : undefined

  const increment =
    available > 0
      ? () => {
          updateEntity({ scale: entity.scale + 1 })
        }
      : undefined

  return (
    <div className={styles['modify-scale']}>
      <button
        disabled={!decrement}
        className={styles['modify-scale-button']}
        onClick={() => decrement?.()}
      >
        <FontAwesomeIcon icon={faMinus} fixedWidth />
      </button>
      <span
        className={styles['modify-scale-current-scale']}
      >
        {entity.scale}
      </span>
      <button
        disabled={!increment}
        className={styles['modify-scale-button']}
        onClick={() => increment?.()}
      >
        <FontAwesomeIcon icon={faPlus} fixedWidth />
      </button>
    </div>
  )
}
