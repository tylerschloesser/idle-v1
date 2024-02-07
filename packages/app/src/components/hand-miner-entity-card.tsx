import { useContext } from 'react'
import { HAND_MINE_TICK_COUNT } from '../const.js'
import { Context } from '../context.js'
import { HomeContext } from '../home-context.js'
import { ItemIcon } from '../icon.component.js'
import { ITEM_TYPE_TO_LABEL } from '../item-label.component.js'
import { Text } from '../text.component.js'
import { formatItemCount } from '../util.js'
import { HandMinerEntity, ResourceType } from '../world.js'
import {
  EntityCard,
  EntityCardProps,
} from './entity-card.js'
import styles from './hand-miner-entity-card.module.scss'

export function HandMinerEntityCard({
  entity,
}: EntityCardProps<HandMinerEntity>) {
  return (
    <EntityCard entity={entity}>
      <div className={styles['queue']}>
        {entity.queue.map((item, i) => (
          <QueueItem key={i} item={item} />
        ))}
      </div>

      <div className={styles['button-group']}>
        {[
          ResourceType.enum.Coal,
          ResourceType.enum.Stone,
          ResourceType.enum.IronOre,
          ResourceType.enum.CopperOre,
        ].map((type) => (
          <ResourceButton
            key={type}
            type={type}
            entity={entity}
          />
        ))}
      </div>

      <div>Output: {JSON.stringify(entity.output)}</div>
    </EntityCard>
  )
}

function ResourceButton({
  type,
  entity,
}: {
  type: ResourceType
  entity: HandMinerEntity
}) {
  const { block } = useContext(HomeContext)
  const { enqueueHandMineOperation } = useContext(Context)
  return (
    <button
      className={styles['resource-button']}
      onClick={() => {
        enqueueHandMineOperation(entity.id, type)
      }}
    >
      <ItemIcon type={type} size="1.5em" />
      <Text variant="b1" className={styles['button-label']}>
        {[ITEM_TYPE_TO_LABEL[type]]}
      </Text>
      <Text variant="b1" gray>
        {formatItemCount(block.resources[type] ?? 0)}
      </Text>
    </button>
  )
}

function QueueItem({
  item,
}: {
  item: HandMinerEntity['queue'][0]
}) {
  const progress =
    item.ticks / (item.count * HAND_MINE_TICK_COUNT)
  return (
    <div
      className={styles['queue-item']}
      style={
        {
          '--progress': `${progress.toFixed(2)}`,
        } as React.CSSProperties
      }
    >
      <div className={styles['queue-item-progress']} />
      <div className={styles['queue-item-inner']}>
        <ItemIcon type={item.resourceType} size="1.5em" />
        <div>{item.count}s</div>
      </div>
    </div>
  )
}
