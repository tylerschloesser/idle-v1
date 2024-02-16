import { useState } from 'react'
import { Heading3 } from '../heading.component.js'
import { ItemLabel } from '../item-label.component.js'
import { aggregateMetrics } from '../metrics-util.js'
import { CombustionSmelterConfig } from '../store.js'
import {
  CombustionSmelterEntity,
  SmelterRecipeItemType,
} from '../world.js'
import { Metrics } from './metrics.js'
import { ModifyScale } from './modify-scale.js'

export interface ViewCombustionSmelterProps {
  entity: CombustionSmelterEntity
}

export function ViewCombustionSmelter({
  entity,
}: ViewCombustionSmelterProps) {
  const { production, consumption } =
    aggregateMetrics(entity)
  return (
    <>
      <Heading3>Recipe</Heading3>
      <ItemLabel type={entity.recipeItemType} />
      <Heading3>Production</Heading3>
      <Metrics items={production} />
      <Heading3>Consumption</Heading3>
      <Metrics items={consumption} />
      <Heading3>Consumption</Heading3>
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
