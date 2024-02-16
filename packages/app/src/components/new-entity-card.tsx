import { motion } from 'framer-motion'
import { useState } from 'react'
import { ItemIcon } from '../icon.component.js'
import { ITEM_TYPE_TO_LABEL } from '../item-label.component.js'
import { Text } from '../text.component.js'
import { EntityType } from '../world.js'
import { NewCombustionMiner } from './combustion-miner.js'
import { NewCombustionSmelter } from './combustion-smelter.js'
import { EditHandMiner } from './hand-miner-entity-card.js'
import styles from './new-entity-card.module.scss'

export interface NewEntityCardProps {
  entityType: EntityType
  available: number
}

export function NewEntityCard({
  entityType,
  available,
}: NewEntityCardProps) {
  const [scale, setScale] = useState(1)

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
              scale,
              incrementScale:
                available - scale > 0
                  ? () => {
                      setScale((prev) => prev + 1)
                    }
                  : undefined,
              decrementScale:
                scale > 1
                  ? () => {
                      setScale((prev) => prev - 1)
                    }
                  : undefined,
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function renderContent({
  entityType,
  scale,
  incrementScale,
  decrementScale,
  available,
}: {
  entityType: EntityType
  scale: number
  incrementScale?: () => void
  decrementScale?: () => void
  available: number
}) {
  switch (entityType) {
    case EntityType.enum.HandMiner:
      return (
        <EditHandMiner
          scale={scale}
          incrementScale={incrementScale}
          decrementScale={decrementScale}
        />
      )
    case EntityType.enum.CombustionSmelter:
      return (
        <NewCombustionSmelter
          scale={scale}
          incrementScale={incrementScale}
          decrementScale={decrementScale}
        />
      )
    case EntityType.enum.CombustionMiner:
      return <NewCombustionMiner available={available} />
    default:
      return <>TODO {entityType}</>
  }
}
