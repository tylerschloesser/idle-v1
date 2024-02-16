import { motion } from 'framer-motion'
import { useContext, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Button } from '../button.component.js'
import { GroupContext } from '../context.js'
import { ItemIcon } from '../icon.component.js'
import { ITEM_TYPE_TO_LABEL } from '../item-label.component.js'
import { AppDispatch, buildEntity } from '../store.js'
import { Text } from '../text.component.js'
import { EntityType } from '../world.js'
import { NewCombustionMiner } from './combustion-miner.js'
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
  const dispatch = useDispatch<AppDispatch>()
  const { groupId } = useContext(GroupContext)

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
            <Button
              onClick={() => {
                dispatch(
                  buildEntity({
                    entityType,
                    groupId,
                    scale,
                  }),
                )
              }}
              label="Build"
            />
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
}: {
  entityType: EntityType
  scale: number
  incrementScale?: () => void
  decrementScale?: () => void
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
        <EditCombustionSmelter
          scale={scale}
          incrementScale={incrementScale}
          decrementScale={decrementScale}
        />
      )
    case EntityType.enum.CombustionMiner:
      return (
        <NewCombustionMiner
          scale={scale}
          incrementScale={incrementScale}
          decrementScale={decrementScale}
        />
      )
    default:
      return <>TODO {entityType}</>
  }
}
