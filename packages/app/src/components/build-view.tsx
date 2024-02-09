import { Heading2 } from '../heading.component.js'
import { ITEM_TYPE_TO_LABEL } from '../item-label.component.js'
import { Entity, EntityId } from '../world.js'
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
  return (
    <>
      <div>scale: {entity.scale}</div>
      <div>available: {entity.available}</div>
    </>
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
      <ModifyScale entity={entity} />
    </div>
  )
}
