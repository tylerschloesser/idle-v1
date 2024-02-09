import { useContext } from 'react'
import invariant from 'tiny-invariant'
import { Button } from '../button.component.js'
import { Context, GroupContext } from '../context.js'
import { Heading2 } from '../heading.component.js'
import { Text } from '../text.component.js'
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
  const { world } = useContext(Context)
  const { group } = useContext(GroupContext)
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
      <div className={styles['build-button']}>
        <Button onClick={() => {}}>
          <Text invert>Build</Text>
        </Button>
      </div>
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
