import classNames from 'classnames'
import { Fragment, useState } from 'react'
import { ItemIcon } from '../icon.component.js'
import { ITEM_TYPE_TO_LABEL } from '../item-label.component.js'
import { Text } from '../text.component.js'
import { ResourceType } from '../world.js'
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
    useState<ResourceType | null>(null)

  return (
    <EditCombustionMiner
      {...props}
      selectedResourceType={selectedResourceType}
      updateResourceType={updateResourceType}
    />
  )
}

export type EditCombustionMinerProps =
  NewCombustionMinerProps & {
    selectedResourceType: ResourceType | null
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
