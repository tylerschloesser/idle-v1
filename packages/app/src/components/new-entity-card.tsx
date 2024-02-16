import { motion } from 'framer-motion'
import { ItemIcon } from '../icon.component.js'
import { ITEM_TYPE_TO_LABEL } from '../item-label.component.js'
import { Text } from '../text.component.js'
import { EntityType } from '../world.js'
import { NewCombustionMiner } from './combustion-miner.js'
import { NewCombustionSmelter } from './combustion-smelter.js'
import { NewHandMiner } from './hand-miner-entity-card.js'
import styles from './new-entity-card.module.scss'

export interface NewEntityCardProps {
  entityType: EntityType
  available: number
}

export function NewEntityCard({
  entityType,
  available,
}: NewEntityCardProps) {
  return (
    <motion.div layout className={styles['card']}>
      <motion.div
        layout="position"
        className={styles['card-inner']}
      >
        <div className={styles['card-header']}>
          <span>
            <ItemIcon type={entityType} />{' '}
            <Text bold>
              {ITEM_TYPE_TO_LABEL[entityType]}
            </Text>
          </span>
        </div>
        <div className={styles['card-content']}>
          <div className={styles['card-content-inner']}>
            {renderContent({
              available,
              entityType,
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function renderContent({
  entityType,
  available,
}: {
  entityType: EntityType
  available: number
}) {
  switch (entityType) {
    case EntityType.enum.HandMiner:
      return <NewHandMiner available={available} />
    case EntityType.enum.CombustionSmelter:
      return <NewCombustionSmelter available={available} />
    case EntityType.enum.CombustionMiner:
      return <NewCombustionMiner available={available} />
    default:
      return <>TODO {entityType}</>
  }
}
