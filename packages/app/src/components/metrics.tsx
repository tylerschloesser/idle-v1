import { Fragment } from 'react'
import { Heading3 } from '../heading.component.js'
import { ItemLabel } from '../item-label.component.js'
import { mapItems } from '../util.js'
import { EntityTickMetric } from '../world.js'
import styles from './metrics.module.scss'

export interface MetricsProps {
  aggregate: EntityTickMetric
}
export function Metrics({ aggregate }: MetricsProps) {
  return (
    <>
      <Heading3>Production</Heading3>
      <div className={styles.items}>
        {mapItems(
          aggregate.production.items,
          (itemType, count) => (
            <Fragment key={itemType}>
              <span>
                <ItemLabel type={itemType} />
              </span>
              <span>{`${(count / 5).toFixed(2)}/s`}</span>
            </Fragment>
          ),
        )}
      </div>
      <Heading3>Consumption</Heading3>
      <div className={styles.items}>
        {mapItems(
          aggregate.consumption.items,
          (itemType, count) => (
            <Fragment key={itemType}>
              <span>
                <ItemLabel type={itemType} />
              </span>
              <span>{`${(count / 5).toFixed(2)}/s`}</span>
            </Fragment>
          ),
        )}
      </div>
    </>
  )
}
