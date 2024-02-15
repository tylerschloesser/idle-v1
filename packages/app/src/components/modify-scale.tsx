import {
  faMinus,
  faPlus,
} from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './modify-scale.module.scss'

export interface ModifyScaleProps {
  scale: number
  increment?: () => void
  decrement?: () => void
}

export function ModifyScale({
  scale,
  increment,
  decrement,
}: ModifyScaleProps) {
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
        {scale}
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
