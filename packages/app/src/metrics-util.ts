import invariant from 'tiny-invariant'
import {
  EntityId,
  EntityTickMetric,
  ItemType,
  World,
} from './world.js'

export function aggregateMetrics(
  world: World,
  entityId: EntityId,
) {
  const aggregate: EntityTickMetric = {
    satisfaction: 0,
    consumption: {
      items: {},
    },
    production: {
      items: {},
    },
  }

  const metrics = world.metrics[entityId]
  invariant(metrics)

  for (const metric of metrics) {
    aggregate.satisfaction += metric.satisfaction

    for (const [key, value] of Object.entries(
      metric.consumption.items,
    )) {
      const itemType = ItemType.parse(key)
      let existing = aggregate.consumption.items[itemType]
      if (!existing) {
        existing = aggregate.consumption.items[itemType] = {
          count: 0,
          satisfaction: 0,
        }
      }
      existing.count += value.count
      existing.satisfaction += value.satisfaction
    }

    for (const [key, value] of Object.entries(
      metric.production.items,
    )) {
      const itemType = ItemType.parse(key)
      let existing = aggregate.production.items[itemType]
      if (!existing) {
        existing = aggregate.production.items[itemType] = {
          count: 0,
        }
      }
      existing.count += value.count
    }
  }

  aggregate.satisfaction /= 50
  for (const value of Object.values(
    aggregate.consumption.items,
  )) {
    value.count /= 5
    value.satisfaction /= 50
  }
  for (const value of Object.values(
    aggregate.production.items,
  )) {
    value.count /= 5
  }

  return aggregate
}
