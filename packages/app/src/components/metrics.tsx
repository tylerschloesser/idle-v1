import { Fragment } from 'react'
import { ItemLabel } from '../item-label.component.js'
import { mapItems } from '../util.js'
import { ItemType } from '../world.js'
import styles from './metrics.module.scss'

export interface MetricsProps {
  items: Partial<Record<ItemType, { count: number }>>
}
export function Metrics({ items }: MetricsProps) {
  return (
    <div className={styles.items}>
      {mapItems(items, (itemType, count) => (
        <Fragment key={itemType}>
          <span>
            <ItemLabel type={itemType} />
          </span>
          <span>{`${(count / 5).toFixed(2)}/s`}</span>
        </Fragment>
      ))}
    </div>
  )
}
