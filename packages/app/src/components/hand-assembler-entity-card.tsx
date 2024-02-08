import { ItemIcon } from '../icon.component.js'
import { ITEM_TYPE_TO_LABEL } from '../item-label.component.js'
import { Text } from '../text.component.js'
import {
  EntityType,
  HandAssemblerEntity,
} from '../world.js'
import {
  EntityCard,
  EntityCardProps,
} from './entity-card.js'
import styles from './hand-assembler-entity-card.module.scss'
import { HandQueue } from './hand-queue.js'

export function HandAssemblerEntityCard({
  entity,
}: EntityCardProps<HandAssemblerEntity>) {
  return (
    <EntityCard entity={entity}>
      <HandQueue entity={entity} />
      <div className={styles['button-group']}>
        {[
          EntityType.enum.CombustionSmelter,
          EntityType.enum.CombustionMiner,
          EntityType.enum.Assembler,
        ].map((type) => (
          <EntityButton
            key={type}
            type={type}
            entity={entity}
          />
        ))}
      </div>
    </EntityCard>
  )
}

function EntityButton({
  type,
}: {
  type: EntityType
  entity: HandAssemblerEntity
}) {
  return (
    <button
      className={styles['entity-button']}
      onClick={() => {
        console.log('TODO')
      }}
    >
      <ItemIcon type={type} size="1.5em" />
      <Text variant="b1" className={styles['button-label']}>
        {[ITEM_TYPE_TO_LABEL[type]]}
      </Text>
      <Text variant="b1" gray>
        TODO
      </Text>
    </button>
  )
}
