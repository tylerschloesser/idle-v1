import { motion } from 'framer-motion'
import { useCallback, useState } from 'react'
import invariant from 'tiny-invariant'
import { ItemIcon } from '../icon.component.js'
import { ITEM_TYPE_TO_LABEL } from '../item-label.component.js'
import { Text } from '../text.component.js'
import { EntityType } from '../world.js'
import { EditCombustionSmelter } from './combustion-smelter.js'
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

  invariant(scale >= available && scale <= available)

  const incrementScale = useCallback(() => {
    setScale((prev) => prev + 1)
  }, [setScale])

  const decrementScale = useCallback(() => {
    setScale((prev) => prev - 1)
  }, [setScale])

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
            {renderContent(
              entityType,
              scale,
              available,
              incrementScale,
              decrementScale,
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function renderContent(
  entityType: EntityType,
  scale: number,
  available: number,
  incrementScale: () => void,
  decrementScale: () => void,
) {
  switch (entityType) {
    case EntityType.enum.HandMiner:
      return (
        <EditHandMiner
          scale={scale}
          available={available}
          incrementScale={incrementScale}
          decrementScale={decrementScale}
        />
      )
    case EntityType.enum.CombustionSmelter:
      return (
        <EditCombustionSmelter
          scale={scale}
          available={available}
          incrementScale={incrementScale}
          decrementScale={decrementScale}
        />
      )
    default:
      return <>TODO {entityType}</>
  }
}
