import { Fragment } from 'react'
import { number } from 'zod'
import { Heading3 } from '../heading.component.js'
import { ItemLabel } from '../item-label.component.js'
import { formatSatisfaction, mapItems } from '../util.js'
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
          (itemType, item) => (
            <Fragment key={itemType}>
              <span>
                <ItemLabel type={itemType} />
              </span>
              <span>{`${(item.count / 5).toFixed(2)}/s`}</span>
            </Fragment>
          ),
        )}
      </div>
      <Heading3>Consumption</Heading3>
      <div>
        Satisfaction:{' '}
        {formatSatisfaction(aggregate.satisfaction)}
      </div>
      <div className={styles.items}>
        {mapItems<{ count: number; satisfaction: number }>(
          aggregate.consumption.items,
          (itemType, item) => (
            <Fragment key={itemType}>
              <span>
                <ItemLabel type={itemType} />
              </span>
              <span>{`${(item.count / 5).toFixed(2)}/s (${formatSatisfaction(item.satisfaction)})`}</span>
            </Fragment>
          ),
        )}
      </div>
    </>
  )
}
