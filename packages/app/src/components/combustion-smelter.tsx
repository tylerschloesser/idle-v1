import { Button } from '../button.component.js'
import { Heading3 } from '../heading.component.js'
import { useNewEntityConfig } from '../hook.js'
import { ItemLabel } from '../item-label.component.js'
import { aggregateMetrics } from '../metrics-util.js'
import { CombustionSmelterConfig } from '../store.js'
import {
  CombustionSmelterEntity,
  EntityType,
  FuelType,
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
    </>
  )
}

export interface NewCombustionSmelterProps {
  available: number
}

export function NewCombustionSmelter({
  available,
}: NewCombustionSmelterProps) {
  const {
    entity,
    updateEntity,
    incrementScale,
    decrementScale,
    build,
  } = useNewEntityConfig<CombustionSmelterConfig>(
    {
      type: EntityType.enum.CombustionSmelter,
      fuelType: FuelType.enum.Coal,
      recipeItemType: SmelterRecipeItemType.enum.IronPlate,
      scale: 1,
    },
    available,
  )

  return (
    <>
      <EditCombustionSmelter
        entity={entity}
        updateEntity={updateEntity}
        incrementScale={incrementScale}
        decrementScale={decrementScale}
      />
      <Button onClick={build} label="Build" />
    </>
  )
}

export interface EditCombustionSmelterProps {
  entity: CombustionSmelterConfig
  updateEntity: (
    config: Partial<CombustionSmelterConfig>,
  ) => void
  incrementScale?: () => void
  decrementScale?: () => void
}

export function EditCombustionSmelter({
  entity,
  // eslint-disable-next-line
  updateEntity,
  incrementScale,
  decrementScale,
}: EditCombustionSmelterProps) {
  return (
    <>
      <div>TODO edit recipe {entity.recipeItemType}</div>
      <ModifyScale
        scale={entity.scale}
        increment={incrementScale}
        decrement={decrementScale}
      />
    </>
  )
}
