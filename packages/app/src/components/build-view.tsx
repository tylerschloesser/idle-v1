import {
  faMinus,
  faPlus,
} from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useContext } from 'react'
import { WorldContext } from '../context.js'
import { Heading2 } from '../heading.component.js'
import { ITEM_TYPE_TO_LABEL } from '../item-label.component.js'
import { Entity } from '../world.js'
import styles from './build-view.module.scss'

export type ActiveEntity = Pick<
  Entity,
  'id' | 'type' | 'scale'
> & {
  available: number
}

export interface BuildViewProps {
  entities: ActiveEntity[]
}

export function BuildView({ entities }: BuildViewProps) {
  return (
    <div className={styles['build-view']}>
      <Heading2>Active</Heading2>
      {entities.map((entity) => (
        <ExistingEntityCard
          key={entity.id}
          entity={entity}
        />
      ))}
    </div>
  )
}

interface ModifyScaleProps {
  entity: ActiveEntity
}

function ModifyScale({ entity }: ModifyScaleProps) {
  const { incrementEntityScale } = useContext(WorldContext)
  return (
    <div className={styles['modify-scale']}>
      <button
        disabled={entity.scale === 0}
        className={styles['modify-scale-button']}
      >
        <FontAwesomeIcon icon={faMinus} fixedWidth />
      </button>
      <span
        className={styles['modify-scale-current-scale']}
      >
        {entity.scale}
      </span>
      <button
        disabled={entity.available === 0}
        className={styles['modify-scale-button']}
        onClick={() => {
          if (entity.available > 0) {
            incrementEntityScale(entity.id)
          }
        }}
      >
        <FontAwesomeIcon icon={faPlus} fixedWidth />
      </button>
    </div>
  )
}

function ExistingEntityCard({
  entity,
}: {
  entity: ActiveEntity
}) {
  return (
    <div className={styles['existing-entity-card']}>
      <div>{ITEM_TYPE_TO_LABEL[entity.type]} #1</div>
      <div>available: {entity.available}</div>
      <ModifyScale entity={entity} />
    </div>
  )
}
