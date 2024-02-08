import { ItemIcon } from '../icon.component.js'
import { Text } from '../text.component.js'
import { ItemType } from '../world.js'
import styles from './hand-button-group.module.scss'

export interface HandButtonGroupProps {
  buttons: {
    key: string
    onClick: () => void
    itemType: ItemType
    label: string
    extra?: string
  }[]
}

export function HandButtonGroup({
  buttons,
}: HandButtonGroupProps) {
  return (
    <div className={styles['button-group']}>
      {buttons.map(
        ({ key, onClick, itemType, label, extra }) => (
          <button
            key={key}
            className={styles['button']}
            onClick={onClick}
          >
            <ItemIcon type={itemType} size="1.5em" />
            <Text
              variant="b1"
              className={styles['button-label']}
            >
              {label}
            </Text>
            {extra && (
              <Text variant="b1" gray>
                {extra}
              </Text>
            )}
          </button>
        ),
      )}
    </div>
  )
}
