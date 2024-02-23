import classNames from 'classnames'
import { Fragment } from 'react'
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
  CombustionMinerConfig,
  useWorld,
} from '../store.js'
import { Text } from '../text.component.js'
import {
  CombustionMinerEntity,
  EntityType,
  FuelType,
  ResourceType,
} from '../world.js'
import styles from './combustion-miner.module.scss'
import { Metrics } from './metrics.js'
import { ModifyScale } from './modify-scale.js'

export interface ViewCombustionMinerProps {
  entity: CombustionMinerEntity
}

export function ViewCombustionMiner({
  entity,
}: ViewCombustionMinerProps) {
  const world = useWorld()
  const { production, consumption } = aggregateMetrics(
    world,
    entity.id,
  )
  return (
    <>
      <Heading3>Resource</Heading3>
      <ItemLabel type={entity.resourceType} />
      <Heading3>Production</Heading3>
      <Metrics items={production.items} />
      <Heading3>Consumption</Heading3>
      <Metrics items={consumption.items} />
    </>
  )
}

export interface NewCombustionMinerProps {
  available: number
}

export function NewCombustionMiner({
  available,
}: NewCombustionMinerProps) {
  const {
    entity,
    updateEntity,
    incrementScale,
    decrementScale,
    build,
  } = useNewEntityConfig<CombustionMinerConfig>(
    {
      type: EntityType.enum.CombustionMiner,
      scale: 1,
      resourceType: ResourceType.enum.Coal,
      fuelType: FuelType.enum.Coal,
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

export interface EditCombustionMinerProps {
  entity: CombustionMinerEntity
  available: number
}

export function EditCombustionMiner({
  entity,
  available,
}: EditCombustionMinerProps) {
  const { updateEntity, incrementScale, decrementScale } =
    useEditEntity<typeof EntityType.enum.CombustionMiner>(
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

interface EditProps {
  entity: Pick<
    CombustionMinerEntity,
    'scale' | 'resourceType'
  >
  updateEntity: (
    config: Partial<CombustionMinerConfig>,
  ) => void
  incrementScale?: () => void
  decrementScale?: () => void
}

function Edit({
  entity,
  updateEntity,
  incrementScale,
  decrementScale,
}: EditProps) {
  return (
    <>
      <Text>Resource</Text>
      <div className={styles['resource-option-group']}>
        {mapResourceTypes((resourceType) => (
          <Fragment key={resourceType}>
            <div
              className={classNames(
                styles['resource-option'],
                {
                  [styles['resource-option--selected']!]:
                    resourceType === entity.resourceType,
                },
              )}
              onClick={() => {
                updateEntity({ resourceType })
              }}
            >
              <ItemIcon type={resourceType} />
              <Text>
                {ITEM_TYPE_TO_LABEL[resourceType]}
              </Text>
            </div>
          </Fragment>
        ))}
      </div>
      <Text>Scale</Text>
      <ModifyScale
        scale={entity.scale}
        increment={incrementScale}
        decrement={decrementScale}
      />
    </>
  )
}

function mapResourceTypes(
  cb: (resourceType: ResourceType) => JSX.Element,
): JSX.Element[] {
  return Object.values(ResourceType.Values).map((value) => {
    const resourceType = ResourceType.parse(value)
    return cb(resourceType)
  })
}
