import classNames from 'classnames'
import { Button } from '../button.component.js'
import { Heading3 } from '../heading.component.js'
import {
  useEditEntity,
  useNewEntityConfig,
} from '../hook.js'
import { ItemIcon } from '../icon.component.js'
import {
  ITEM_TYPE_TO_LABEL,
  ItemLabel,
} from '../item-label.component.js'
import { aggregateMetrics } from '../metrics-util.js'
import {
  CombustionSmelterConfig,
  useWorld,
} from '../store.js'
import { Text } from '../text.component.js'
import {
  CombustionSmelterEntity,
  EntityType,
  FuelType,
  SmelterRecipeItemType,
} from '../world.js'
import styles from './combustion-smelter.module.scss'
import { Metrics } from './metrics.js'
import { ModifyScale } from './modify-scale.js'

export interface ViewCombustionSmelterProps {
  entity: CombustionSmelterEntity
}

export function ViewCombustionSmelter({
  entity,
}: ViewCombustionSmelterProps) {
  const world = useWorld()
  const aggregate = aggregateMetrics(world, entity.id)
  return (
    <>
      <Heading3>Recipe</Heading3>
      <ItemLabel type={entity.recipeItemType} />
      <Metrics aggregate={aggregate} />
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
      <Edit
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
  entity: CombustionSmelterEntity
  available: number
}

export function EditCombustionSmelter({
  entity,
  available,
}: EditCombustionSmelterProps) {
  const { updateEntity, incrementScale, decrementScale } =
    useEditEntity<typeof EntityType.enum.CombustionSmelter>(
      entity,
      available,
    )
  return (
    <Edit
      entity={entity}
      updateEntity={updateEntity}
      incrementScale={incrementScale}
      decrementScale={decrementScale}
    />
  )
}

export interface EditProps {
  entity: Pick<
    CombustionSmelterEntity,
    'scale' | 'recipeItemType'
  >
  updateEntity: (
    config: Partial<CombustionSmelterConfig>,
  ) => void
  incrementScale?: () => void
  decrementScale?: () => void
}

function Edit({
  entity,
  // eslint-disable-next-line
  updateEntity,
  incrementScale,
  decrementScale,
}: EditProps) {
  return (
    <>
      <div className={styles['recipe-option-group']}>
        {[
          SmelterRecipeItemType.enum.IronPlate,
          SmelterRecipeItemType.enum.CopperPlate,
          SmelterRecipeItemType.enum.StoneBrick,
          SmelterRecipeItemType.enum.SteelPlate,
        ].map((recipeItemType) => (
          <div
            key={recipeItemType}
            className={classNames(styles['recipe-option'], {
              [styles['recipe-option--selected']!]:
                recipeItemType === entity.recipeItemType,
            })}
            onClick={() => {
              updateEntity({
                recipeItemType,
              })
            }}
          >
            <ItemIcon type={recipeItemType} />
            <Text>
              {ITEM_TYPE_TO_LABEL[recipeItemType]}
            </Text>
          </div>
        ))}
      </div>
      <ModifyScale
        scale={entity.scale}
        increment={incrementScale}
        decrement={decrementScale}
      />
    </>
  )
}
