import { ITEM_TYPE_TO_LABEL } from '../item-label.component.js'
import { Entity } from '../world.js'

export interface BuildViewProps {
  entities: Entity[]
}

export function BuildView({ entities }: BuildViewProps) {
  return (
    <>
      {entities.map((entity) => (
        <ExistingEntityCard
          key={entity.id}
          entity={entity}
        />
      ))}
    </>
  )
}

function ExistingEntityCard({
  entity,
}: {
  entity: Entity
}) {
  return (
    <>
      <div>{ITEM_TYPE_TO_LABEL[entity.type]} #1</div>
      <div>{entity.scale}</div>
    </>
  )
}
