import classNames from 'classnames'
import { HAND_MINE_TICK_COUNT } from '../const.js'
import { ItemIcon } from '../icon.component.js'
import {
  EntityType,
  HandAssemblerEntity,
  HandMinerEntity,
  ItemType,
} from '../world.js'
import styles from './hand-queue.module.scss'

export interface HandQueueProps {
  entity: HandMinerEntity | HandAssemblerEntity
}

export function HandQueue({ entity }: HandQueueProps) {
  const queue =
    entity.type === EntityType.enum.HandMiner
      ? entity.queue.map((item) => ({
          ...item,
          type: item.resourceType,
        }))
      : entity.queue.map((item) => ({
          ...item,
          type: item.recipeItemType,
        }))

  return (
    <div className={styles['queue']}>
      {entity.queue.length === 0 && (
        <QueueItemPlaceholder />
      )}
      {entity.type === EntityType.enum.HandMiner
        ? queue.map((item) => (
            <QueueItem key={item.id} item={item} />
          ))
        : queue.map((item) => (
            <QueueItem key={item.id} item={item} />
          ))}
    </div>
  )
}

interface QueueItemProps {
  item: {
    type: ItemType
    ticks: number
    count: number
  }
  placeholder?: boolean
}
function QueueItem({
  item,
  placeholder = false,
}: QueueItemProps) {
  const { type, ticks, count } = item
  const progress = ticks / (count * HAND_MINE_TICK_COUNT)
  return (
    <div
      className={classNames(styles['queue-item'], {
        [styles['queue-item--placeholder']!]: placeholder,
      })}
      style={
        {
          '--progress': `${progress.toFixed(2)}`,
        } as React.CSSProperties
      }
    >
      <div className={styles['queue-item-progress']} />
      <div className={styles['queue-item-inner']}>
        <ItemIcon type={type} size="1.5em" />
        <div>{count}s</div>
      </div>
    </div>
  )
}

export function QueueItemPlaceholder() {
  return (
    <QueueItem
      item={{
        count: 1,
        type: ItemType.enum.Coal,
        ticks: 1,
      }}
      placeholder
    />
  )
}
