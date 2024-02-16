import classNames from 'classnames'
import { Fragment, useContext, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Button } from '../button.component.js'
import { GroupContext } from '../context.js'
import { Heading3 } from '../heading.component.js'
import { ItemIcon } from '../icon.component.js'
import {
  ITEM_TYPE_TO_LABEL,
  ItemLabel,
} from '../item-label.component.js'
import {
  AppDispatch,
  CombustionMinerConfig,
  buildEntity,
} from '../store.js'
import { Text } from '../text.component.js'
import {
  CombustionMinerEntity,
  EntityType,
  FuelType,
  ResourceType,
} from '../world.js'
import styles from './combustion-miner.module.scss'
import { ModifyScale } from './modify-scale.js'

export interface ViewCombustionMinerProps {
  entity: CombustionMinerEntity
}

export function ViewCombustionMiner({
  entity,
}: ViewCombustionMinerProps) {
  return (
    <>
      <Heading3>Resource</Heading3>
      <ItemLabel type={entity.resourceType} />
    </>
  )
}

export interface NewCombustionMinerProps {
  available: number
}

export function NewCombustionMiner({
  available,
}: NewCombustionMinerProps) {
  const [config, setConfig] = useState<
    Pick<CombustionMinerConfig, 'resourceType' | 'scale'>
  >({
    resourceType: ResourceType.enum.Coal,
    scale: 1,
  })

  const dispatch = useDispatch<AppDispatch>()
  const { groupId } = useContext(GroupContext)

  return (
    <>
      <EditCombustionMiner
        entity={config}
        updateEntity={(update) => {
          setConfig({
            ...config,
            ...update,
          })
        }}
        available={available}
      />
      <Button
        onClick={() => {
          dispatch(
            buildEntity({
              groupId,
              config: {
                type: EntityType.enum.CombustionMiner,
                fuelType: FuelType.enum.Coal,
                ...config,
              },
            }),
          )
        }}
        label="Build"
      />
    </>
  )
}

export interface EditCombustionMinerProps {
  entity: Pick<
    CombustionMinerEntity,
    'scale' | 'resourceType'
  >
  updateEntity: (
    config: Partial<CombustionMinerConfig>,
  ) => void
  available: number
}

export function EditCombustionMiner({
  entity,
  updateEntity,
  available,
}: EditCombustionMinerProps) {
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
        entity={entity}
        updateEntity={updateEntity}
        available={available}
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
