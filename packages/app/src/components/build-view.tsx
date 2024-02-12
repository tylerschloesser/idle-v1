import { isEqual } from 'lodash-es'
import React from 'react'
import { Heading2 } from '../heading.component.js'
import { ItemIcon } from '../icon.component.js'
import { ITEM_TYPE_TO_LABEL } from '../item-label.component.js'
import { Text } from '../text.component.js'
import { Entity } from '../world.js'
import styles from './build-view.module.scss'
import { ModifyScale } from './modify-scale.js'
import {
  NewEntityCard,
  NewEntityCardProps,
} from './new-entity-card.js'

export type ActiveEntity = Pick<
  Entity,
  'id' | 'type' | 'scale'
> & {
  available: number
}

export interface BuildViewProps {
  entities: ActiveEntity[]
  availableEntityTypes: NewEntityCardProps['availableEntityTypes']
}

export const BuildView = React.memo(function BuildView({
  entities,
  availableEntityTypes,
}: BuildViewProps) {
  return (
    <div className={styles['build-view']}>
      <Heading2>Active</Heading2>
      {entities.map((entity) => (
        <ExistingEntityCard
          key={entity.id}
          entity={entity}
        />
      ))}
      <Heading2>New</Heading2>
      <NewEntityCard
        availableEntityTypes={availableEntityTypes}
      />
    </div>
  )
}, isEqual)

function ExistingEntityCard({
  entity,
}: {
  entity: ActiveEntity
}) {
  return (
    <div className={styles['existing-entity-card']}>
      <Text>
        <ItemIcon type={entity.type} />
        {ITEM_TYPE_TO_LABEL[entity.type]} #1
      </Text>
      <div>available: {entity.available}</div>
      <ModifyScale entity={entity} />
    </div>
  )
}
