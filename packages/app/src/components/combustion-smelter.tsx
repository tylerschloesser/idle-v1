import { ItemLabel } from '../item-label.component.js'
import { Text } from '../text.component.js'
import { formatItemCount, mapItems } from '../util.js'
import {
  CombustionSmelterEntity,
  ItemType,
  TickMetricType,
} from '../world.js'
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
      <div>
        <Text>Production</Text>
      </div>
      {mapItems(production, (itemType, count) => (
        <div key={itemType}>
          <ItemLabel type={itemType} />{' '}
          {`${(count / 5).toFixed(2)}/s`}
        </div>
      ))}
      <div>
        <Text>Consumption</Text>
      </div>
      {mapItems(consumption, (itemType, count) => (
        <div key={itemType}>
          <ItemLabel type={itemType} />{' '}
          {`${(count / 5).toFixed(2)}/s`}
        </div>
      ))}
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
