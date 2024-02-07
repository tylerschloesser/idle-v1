import { Fragment } from 'react'
import {
  EntityCard,
  EntityCardProps,
} from './components/entity-card.js'
import { HandAssemblerEntityCard } from './components/hand-assembler-entity-card.js'
import { HandMinerEntityCard } from './components/hand-miner-entity-card.js'
import { Heading2 } from './heading.component.js'
import { HomeContext } from './home-context.js'
import { ItemIcon } from './icon.component.js'
import { formatItemCount } from './util.js'
import { useModel } from './world-home.hooks.js'
import styles from './world-home.module.scss'
import {
  BufferEntity,
  Entity,
  EntityType,
  ItemType,
} from './world.js'

function BufferEntityCard({
  entity,
}: EntityCardProps<BufferEntity>) {
  const empty = Object.keys(entity.contents).length === 0
  return (
    <EntityCard entity={entity} empty={empty}>
      <div className={styles['contents']}>
        {Object.entries(entity.contents).map(
          ([key, value]) => (
            <Fragment key={key}>
              <div>
                <ItemIcon type={ItemType.parse(key)} />{' '}
                {key}
              </div>
              <div>{formatItemCount(value.count)}</div>
            </Fragment>
          ),
        )}
      </div>
    </EntityCard>
  )
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

export function WorldHome() {
  const model = useModel()

  if (!model) return null

  const { block, entities } = model

  return (
    <HomeContext.Provider value={{ block }}>
      <div className={styles['world-home']}>
        <Heading2>Entities</Heading2>
        {entities.map((entity) => (
          <div className={styles.card} key={entity.id}>
            {renderEntityCard(entity)}
          </div>
        ))}
      </div>
    </HomeContext.Provider>
  )
}
