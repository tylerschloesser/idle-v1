import classNames from 'classnames'
import { AnimatePresence, motion } from 'framer-motion'
import { HAND_MINE_TICK_COUNT } from '../const.js'
import { ItemIcon } from '../icon.component.js'
import { Text } from '../text.component.js'
import {
  EntityType,
  HandAssemblerEntity,
  HandMinerEntity,
  ItemType,
} from '../world.js'
import styles from './hand-queue.module.scss'

export interface HandQueueProps {
  entity: HandMinerEntity | HandAssemblerEntity
  cancel?: (itemId: string) => void
}

export function HandQueue({
  entity,
  cancel,
}: HandQueueProps) {
  const queue =
    entity.type === EntityType.enum.HandMiner
      ? entity.queue.map((item) => ({
          id: item.id,
          type: item.resourceType,
          progress:
            item.ticks /
            (item.count * HAND_MINE_TICK_COUNT),
          extra: `${item.count}s`,
        }))
      : entity.queue.map((item) => ({
          id: item.id,
          type: item.recipeItemType,
          progress: 0, // TODO
          extra: `${item.count}`,
        }))

  return (
    <div className={styles['container']}>
      <div className={styles['label']}>
        <Text variant="b1">Queue</Text>
        {cancel && <Text variant="b1">Tap to cancel</Text>}
      </div>
      <div className={styles['queue']}>
        <AnimatePresence initial={false}>
          {entity.type === EntityType.enum.HandMiner
            ? queue.map((item) => (
                <QueueItem
                  key={item.id}
                  item={item}
                  cancel={cancel}
                />
              ))
            : queue.map((item) => (
                <QueueItem
                  key={item.id}
                  item={item}
                  cancel={cancel}
                />
              ))}
        </AnimatePresence>
        {entity.queue.length === 0 && (
          <QueueItemPlaceholder />
        )}
      </div>
    </div>
  )
}

interface QueueItemProps {
  item: {
    id: string
    type: ItemType
    progress: number
    extra: string
  }
  placeholder?: boolean
  cancel?: (itemId: string) => void
}
function QueueItem({
  item,
  placeholder = false,
  cancel,
}: QueueItemProps) {
  const { type, progress, extra } = item
  return (
    <motion.div
      key={item.id}
      layout="position"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={classNames(styles['queue-item'], {
        [styles['queue-item--placeholder']!]: placeholder,
      })}
      style={
        {
          '--progress': `${progress.toFixed(2)}`,
        } as React.CSSProperties
      }
      onClick={
        cancel &&
        (() => {
          cancel(item.id)
        })
      }
    >
      <motion.div
        initial={{
          width: 0,
        }}
        animate={{
          width: `${progress * 100}%`,
        }}
        transition={{ ease: 'linear' }}
        className={styles['queue-item-progress']}
      />
      <div className={styles['queue-item-inner']}>
        <ItemIcon type={type} size="1.5em" />
        <div>{extra}</div>
      </div>
    </motion.div>
  )
}

export function QueueItemPlaceholder() {
  return (
    <QueueItem
      item={{
        id: '0',
        type: ItemType.enum.Coal,
        progress: 0,
        extra: '0',
      }}
      placeholder
    />
  )
}
