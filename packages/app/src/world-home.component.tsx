import { Fragment } from 'react'
import { Heading2 } from './heading.component.js'
import { ItemIcon } from './icon.component.js'
import { ITEM_TYPE_TO_LABEL } from './item-label.component.js'
import { Text } from './text.component.js'
import { formatItemCount } from './util.js'
import { useModel } from './world-home.hooks.js'
import styles from './world-home.module.scss'
import {
  Block,
  Entity,
  EntityType,
  HandMinerEntity,
  ResourceType,
} from './world.js'

type HandMinerEntityCardProps = {
  entity: HandMinerEntity
  block: Block
}

function HandMinerEntityCard({
  entity,
  block,
}: HandMinerEntityCardProps) {
  return (
    <Fragment>
      <div className={styles['card-header']}>
        <ItemIcon type={entity.type} />{' '}
        {[ITEM_TYPE_TO_LABEL[entity.type]]}
      </div>
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
    </Fragment>
  )
}

function renderEntityCard(entity: Entity, block: Block) {
  switch (entity.type) {
    case EntityType.enum.HandMiner:
      return (
        <HandMinerEntityCard
          entity={entity}
          block={block}
        />
      )
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
      {entities.map((entity) => (
        <div className={styles.card} key={entity.id}>
          {renderEntityCard(entity, block)}
        </div>
      ))}
    </div>
  )
}
