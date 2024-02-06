import { useContext } from 'react'
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
