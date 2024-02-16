import { Fragment } from 'react'
import { Heading3 } from '../heading.component.js'
import { ItemLabel } from '../item-label.component.js'
import { Text } from '../text.component.js'
import { mapItems } from '../util.js'
import {
  CombustionSmelterEntity,
  ItemType,
  TickMetricType,
} from '../world.js'
import styles from './combustion-smelter.module.scss'
import { ModifyScale } from './modify-scale.js'

export interface ViewCombustionSmelterProps {
  entity: CombustionSmelterEntity
}

export function ViewCombustionSmelter({
  entity,
}: ViewCombustionSmelterProps) {
  const production: Partial<Record<ItemType, number>> = {}
  const consumption: Partial<Record<ItemType, number>> = {}

  for (const tick of entity.metrics) {
    for (const metric of tick) {
      switch (metric.type) {
        case TickMetricType.enum.ConsumeItem: {
          consumption[metric.itemType] =
            (consumption[metric.itemType] ?? 0) +
            metric.count
          break
        }
        case TickMetricType.enum.ProduceItem: {
          production[metric.itemType] =
            (production[metric.itemType] ?? 0) +
            metric.count
          break
        }
      }
    }
  }

  return (
    <>
      <Heading3>Production</Heading3>
      <div className={styles.items}>
        {mapItems(production, (itemType, count) => (
          <Fragment key={itemType}>
            <span>
              <ItemLabel type={itemType} />
            </span>
            <span>{`${(count / 5).toFixed(2)}/s`}</span>
          </Fragment>
        ))}
      </div>
      <Heading3>Consumption</Heading3>
      <div className={styles.items}>
        {mapItems(consumption, (itemType, count) => (
          <Fragment key={itemType}>
            <span>
              <ItemLabel type={itemType} />
            </span>
            {`${(count / 5).toFixed(2)}/s`}
          </Fragment>
        ))}
      </div>
    </>
  )
}

export interface EditCombustionSmelterProps {
  scale: number
  incrementScale?: () => void
  decrementScale?: () => void
}

export function EditCombustionSmelter({
  scale,
  incrementScale,
  decrementScale,
}: EditCombustionSmelterProps) {
  return (
    <ModifyScale
      scale={scale}
      increment={incrementScale}
      decrement={decrementScale}
    />
  )
}
