import { Fragment, createContext, useContext } from 'react'
import { Context } from './context.js'
import { EntityCard } from './entity-card.component.js'
import { Heading2 } from './heading.component.js'
import { ItemIcon } from './icon.component.js'
import { ITEM_TYPE_TO_LABEL } from './item-label.component.js'
import { Text } from './text.component.js'
import { formatItemCount } from './util.js'
import { useModel } from './world-home.hooks.js'
import styles from './world-home.module.scss'
import {
  Block,
  BufferEntity,
  Entity,
  EntityType,
  HandMinerEntity,
  ItemType,
  ResourceType,
} from './world.js'

interface IHomeContext {
  block: Block
}
const HomeContext = createContext<IHomeContext>(null!)

type HandMinerEntityCardProps = {
  entity: HandMinerEntity
}

function HandMinerEntityCard({
  entity,
}: HandMinerEntityCardProps) {
  const { block } = useContext(HomeContext)
  const { enqueueHandMineOperation } = useContext(Context)

  return (
    <EntityCard entity={entity}>
      <div className={styles['queue']}>
        Queue
        {JSON.stringify(entity.queue)}
      </div>

      <div className={styles['button-group']}>
        {[
          ResourceType.enum.Coal,
          ResourceType.enum.Stone,
          ResourceType.enum.IronOre,
          ResourceType.enum.CopperOre,
        ].map((resourceType) => (
          <button
            className={styles.button}
            key={resourceType}
            onClick={() => {
              enqueueHandMineOperation(
                entity.id,
                resourceType,
              )
            }}
          >
            <ItemIcon type={resourceType} size="1.5em" />
            <Text
              variant="b1"
              className={styles['button-label']}
            >
              {[ITEM_TYPE_TO_LABEL[resourceType]]}
            </Text>
            <Text variant="b1" gray>
              {formatItemCount(
                block.resources[resourceType] ?? 0,
              )}
            </Text>
          </button>
        ))}
      </div>

      <div>Output: {JSON.stringify(entity.output)}</div>
    </EntityCard>
  )
}

type BufferEntityCardProps = {
  entity: BufferEntity
}

function BufferEntityCard({
  entity,
}: BufferEntityCardProps) {
  return (
    <EntityCard entity={entity}>
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
