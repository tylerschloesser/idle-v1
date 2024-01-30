import { ItemIcon } from './icon.component.js'
import styles from './item-label.module.scss'
import { Text } from './text.component.js'
import { ItemType } from './world.js'

export interface ItemLabelProps {
  type: ItemType
}

export function ItemLabel({ type }: ItemLabelProps) {
  return (
    <span className={styles['item-label']}>
      <ItemIcon type={type} />
      <Text>{type}</Text>
    </span>
  )
}
