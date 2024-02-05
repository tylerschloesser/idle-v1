import { Heading2 } from './heading.component.js'
import { useModel } from './world-home.hooks.js'
import styles from './world-home.module.scss'
import {
  Entity,
  EntityType,
  HandMinerEntity,
} from './world.js'

type HandMinerEntityCardProps = {
  entity: HandMinerEntity
}

function HandMinerEntityCard({
  entity,
}: HandMinerEntityCardProps) {
  return <>{entity.type}</>
}

function renderEntityCard(entity: Entity) {
  switch (entity.type) {
    case EntityType.enum.HandMiner:
      return <HandMinerEntityCard entity={entity} />
    default:
      return <>TODO {entity.type}</>
  }
}

export function WorldHome() {
  const model = useModel()

  if (!model) return null

  return (
    <div className={styles['world-home']}>
      <Heading2>Entities</Heading2>
      {model.entities.map((entity) => (
        <div className={styles.entity} key={entity.id}>
          {renderEntityCard(entity)}
        </div>
      ))}
    </div>
  )
}
