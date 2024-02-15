import {
  faMinus,
  faPlus,
} from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import invariant from 'tiny-invariant'
import styles from './modify-scale.module.scss'

export interface ModifyScaleProps {
  scale: number
  available: number
  increment(): void
  decrement(): void
}

function isPositiveInteger(v: number): boolean {
  return v === Math.floor(v) && v >= 0
}

export function ModifyScale({
  scale,
  available,
  increment,
  decrement,
}: ModifyScaleProps) {
  invariant(isPositiveInteger(scale))
  invariant(isPositiveInteger(available))

  return (
    <div className={styles['modify-scale']}>
      <button
        disabled={scale === 1}
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
