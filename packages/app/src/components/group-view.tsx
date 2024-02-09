import { useContext } from 'react'
import { Link } from 'react-router-dom'
import invariant from 'tiny-invariant'
import { GroupContext, WorldContext } from '../context.js'
import { Heading2 } from '../heading.component.js'
import {
  Entity,
  EntityType,
  Group,
  World,
} from '../world.js'
import { BufferEntityCard } from './buffer-entity-card.js'
import styles from './group-view.module.scss'
import { HandAssemblerEntityCard } from './hand-assembler-entity-card.js'
import { HandMinerEntityCard } from './hand-miner-entity-card.js'

export function GroupView() {
  const { world } = useContext(WorldContext)
  const { block, group } = useContext(GroupContext)
  const entities = getEntities(world, group)

  return (
    <div className={styles['group-view']}>
      <Heading2>Entities</Heading2>
      <div className={styles['entity-list']}>
        {entities.map((entity) => (
          <div className={styles.card} key={entity.id}>
            {renderEntityCard(entity)}
          </div>
        ))}
      </div>

      <Link
        to={`/world/${world.id}/block/${block.id}/group/${group.id}/build`}
        className={styles['build-button']}
      >
        Build
      </Link>
    </div>
  )
}

function getEntities(world: World, group: Group): Entity[] {
  return Object.keys(group.entityIds).map((entityId) => {
    const entity = world.entities[entityId]
    invariant(entity)
    return entity
  })
}

function renderEntityCard(entity: Entity) {
  switch (entity.type) {
    case EntityType.enum.HandMiner:
      return <HandMinerEntityCard entity={entity} />
    case EntityType.enum.HandAssembler:
      return <HandAssemblerEntityCard entity={entity} />
    case EntityType.enum.Buffer:
      return <BufferEntityCard entity={entity} />
    default:
      return <>TODO {entity.type}</>
  }
}