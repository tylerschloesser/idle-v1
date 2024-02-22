import { createSelector } from '@reduxjs/toolkit'
import { LayoutGroup, motion } from 'framer-motion'
import { useContext } from 'react'
import { useSelector } from 'react-redux'
import invariant from 'tiny-invariant'
import { BlockContext } from '../context.js'
import { Heading2 } from '../heading.component.js'
import { RootState } from '../store.js'
import { BlockId } from '../world.js'
import styles from './block-view.module.scss'
import { EntityCard } from './entity-card.js'
import { NewEntityCardList } from './new-entity-card-list.js'

const selectBlock = createSelector(
  [
    (state: RootState) => state.world.blocks,
    (_state: RootState, blockId: BlockId) => blockId,
  ],
  (blocks, blockId) => {
    const block = blocks[blockId]
    invariant(block)
    return block
  },
)

export function BlockView() {
  const { blockId } = useContext(BlockContext)
  const block = useSelector((state: RootState) =>
    selectBlock(state, blockId),
  )
  const entityIds = Object.keys(block.entityIds)

  return (
    <div className={styles['group-view']}>
      <LayoutGroup>
        <motion.div layout>
          <Heading2 className={styles.heading}>
            Entities
          </Heading2>
        </motion.div>
        {entityIds.map((entityId) => (
          <EntityCard key={entityId} entityId={entityId} />
        ))}
        <motion.div layout>
          <Heading2 className={styles.heading}>
            Build
          </Heading2>
        </motion.div>
        <NewEntityCardList />
      </LayoutGroup>
    </div>
  )
}
