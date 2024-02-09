import { Button } from './button.component.js'
import { BufferEntityCard } from './components/buffer-entity-card.js'
import { HandAssemblerEntityCard } from './components/hand-assembler-entity-card.js'
import { HandMinerEntityCard } from './components/hand-miner-entity-card.js'
import { Heading2 } from './heading.component.js'
import { Text } from './text.component.js'
import { useModel } from './world-home.hooks.js'
import styles from './world-home.module.scss'
import { Entity, EntityType } from './world.js'

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

export function WorldHome() {
  const model = useModel()

  if (!model) return null

  const { block, entities } = model

  return (
    <div className={styles['world-home']}>
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
