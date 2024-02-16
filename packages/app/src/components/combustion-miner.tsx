import classNames from 'classnames'
import { Fragment, useContext, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Button } from '../button.component.js'
import { GroupContext } from '../context.js'
import { ItemIcon } from '../icon.component.js'
import { ITEM_TYPE_TO_LABEL } from '../item-label.component.js'
import { AppDispatch, buildEntity } from '../store.js'
import { Text } from '../text.component.js'
import {
  EntityType,
  FuelType,
  ResourceType,
} from '../world.js'
import styles from './combustion-miner.module.scss'
import { ModifyScale } from './modify-scale.js'

export interface NewCombustionMinerProps {
  scale: number
  incrementScale?: () => void
  decrementScale?: () => void
}

export function NewCombustionMiner(
  props: NewCombustionMinerProps,
) {
  const [selectedResourceType, updateResourceType] =
    useState<ResourceType>(ResourceType.enum.Coal)

  const dispatch = useDispatch<AppDispatch>()
  const { groupId } = useContext(GroupContext)

  return (
    <>
      <EditCombustionMiner
        {...props}
        selectedResourceType={selectedResourceType}
        updateResourceType={updateResourceType}
      />
      <Button
        onClick={() => {
          dispatch(
            buildEntity({
              groupId,
              config: {
                type: EntityType.enum.CombustionMiner,
                scale: props.scale,
                resourceType: selectedResourceType,
                fuelType: FuelType.enum.Coal,
              },
            }),
          )
        }}
        label="Build"
      />
    </>
  )
}

export type EditCombustionMinerProps =
  NewCombustionMinerProps & {
    selectedResourceType: ResourceType
    updateResourceType: (resourceType: ResourceType) => void
  }

export function EditCombustionMiner({
  scale,
  incrementScale,
  decrementScale,
  selectedResourceType,
  updateResourceType,
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
                    resourceType === selectedResourceType,
                },
              )}
              onClick={() => {
                updateResourceType(resourceType)
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
        scale={scale}
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
