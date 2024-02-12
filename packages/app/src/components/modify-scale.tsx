import {
  faMinus,
  faPlus,
} from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useContext } from 'react'
import { WorldContext } from '../context.js'
import { Entity } from '../world.js'
import styles from './modify-scale.module.scss'

type ActiveEntity = Pick<
  Entity,
  'id' | 'type' | 'scale'
> & {
  available: number
}

export interface ModifyScaleProps {
  entity: ActiveEntity
}

export function ModifyScale({ entity }: ModifyScaleProps) {
  const { incrementEntityScale } = useContext(WorldContext)
  return (
    <div className={styles['modify-scale']}>
      <button
        disabled={entity.scale === 0}
        className={styles['modify-scale-button']}
      >
        <FontAwesomeIcon icon={faMinus} fixedWidth />
      </button>
      <span
        className={styles['modify-scale-current-scale']}
      >
        {entity.scale}
      </span>
      <button
        disabled={entity.available === 0}
        className={styles['modify-scale-button']}
        onClick={() => {
          if (entity.available > 0) {
            incrementEntityScale(entity.id)
          }
        }}
      >
        <FontAwesomeIcon icon={faPlus} fixedWidth />
      </button>
    </div>
  )
}
