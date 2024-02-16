import {
  Entity,
  ItemType,
  TickMetricType,
} from './world.js'

export function aggregateMetrics(entity: Entity): {
  production: Partial<Record<ItemType, number>>
  consumption: Partial<Record<ItemType, number>>
} {
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
  return { production, consumption }
}
