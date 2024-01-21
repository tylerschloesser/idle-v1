import { Fragment, useContext } from 'react'
import { Context } from './context.js'
import styles from './mine.module.scss'
import { ResourceType } from './world.js'

interface MineButtonProps {
  resourceType: ResourceType
}

function MineButton({ resourceType }: MineButtonProps) {
  const { addItemToInventory } = useContext(Context)
  return (
    <button
      className={styles.button}
      onPointerUp={() => {
        addItemToInventory(resourceType)
      }}
    >
      Mine
    </button>
  )
}
export function Mine() {
  const { world } = useContext(Context)
  return (
    <div className={styles.mine}>
      {Object.values(ResourceType.enum).map(
        (resourceType) => (
          <Fragment key={resourceType}>
            <div className={styles.label}>
              {resourceType}
            </div>
            <div className={styles.count}>
              {world.inventory[resourceType] ?? 0}
            </div>
            <MineButton resourceType={resourceType} />
          </Fragment>
        ),
      )}
    </div>
  )
}
