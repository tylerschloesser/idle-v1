import {
  faMinus,
  faPlus,
} from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './modify-scale.module.scss'

export interface ModifyScaleProps {
  scale: number
  available: number
  increment(): void
  decrement(): void
}

export function ModifyScale({
  scale,
  available,
  increment,
  decrement,
}: ModifyScaleProps) {
  return (
    <div className={styles['modify-scale']}>
      <button
        disabled={scale === 0}
        className={styles['modify-scale-button']}
        onClick={() => {
          if (scale > 0) {
            decrement()
          }
        }}
      >
        <FontAwesomeIcon icon={faMinus} fixedWidth />
      </button>
      <span
        className={styles['modify-scale-current-scale']}
      >
        {scale}
      </span>
      <button
        disabled={available === 0}
        className={styles['modify-scale-button']}
        onClick={() => {
          if (available > 0) {
            increment()
          }
        }}
      >
        <FontAwesomeIcon icon={faPlus} fixedWidth />
      </button>
    </div>
  )
}
