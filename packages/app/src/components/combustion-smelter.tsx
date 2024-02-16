import { Fragment, useState } from 'react'
import { Heading3 } from '../heading.component.js'
import { ItemLabel } from '../item-label.component.js'
import { CombustionSmelterConfig } from '../store.js'
import { mapItems } from '../util.js'
import {
  CombustionSmelterEntity,
  ItemType,
  SmelterRecipeItemType,
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
      <Heading3>Recipe</Heading3>
      <ItemLabel type={entity.recipeItemType} />
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

export interface NewCombustionSmelterProps {
  available: number
}

export function NewCombustionSmelter({
  available,
}: NewCombustionSmelterProps) {
  const [config, setConfig] = useState<
    Pick<
      CombustionSmelterConfig,
      'scale' | 'recipeItemType'
    >
  >({
    scale: 1,
    recipeItemType: SmelterRecipeItemType.enum.IronPlate,
  })

  return (
    <EditCombustionSmelter
      entity={config}
      updateEntity={(update) => {
        setConfig({ ...config, ...update })
      }}
      available={available}
    />
  )
}

export interface EditCombustionSmelterProps {
  entity: Pick<
    CombustionSmelterEntity,
    'scale' | 'recipeItemType'
  >
  updateEntity: (
    config: Partial<CombustionSmelterConfig>,
  ) => void
  available: number
}

export function EditCombustionSmelter({
  entity,
  updateEntity,
  available,
}: EditCombustionSmelterProps) {
  return (
    <ModifyScale
      entity={entity}
      updateEntity={updateEntity}
      available={available}
    />
  )
}
