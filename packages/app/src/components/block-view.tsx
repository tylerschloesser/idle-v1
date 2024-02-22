import { LayoutGroup, motion } from 'framer-motion'
import { useContext } from 'react'
import { BlockContext } from '../context.js'
import { Heading2 } from '../heading.component.js'
import { BlockItems } from './block-items.js'
import styles from './block-view.module.scss'
import { EntityCard } from './entity-card.js'
import { NewEntityCardList } from './new-entity-card-list.js'

export function BlockView() {
  const { block } = useContext(BlockContext)
  const entityIds = Object.keys(block.entityIds)

  return (
    <div className={styles['group-view']}>
      <LayoutGroup>
        <motion.div layout>
          <Heading2 className={styles.heading}>
            Items
          </Heading2>
          <BlockItems block={block} />
        </motion.div>
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
