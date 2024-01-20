import { Fragment, useContext } from 'react'
import { Context } from './context.js'
import styles from './mine.module.scss'
import { ItemType, itemType } from './world.js'

interface MineButtonProps {
  itemType: ItemType
}

function MineButton({ itemType }: MineButtonProps) {
  const { addItemToInventory } = useContext(Context)
  return (
    <button
      className={styles.button}
      onPointerUp={() => {
        addItemToInventory(itemType)
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
      {Object.values(itemType.Values).map((itemType) => (
        <Fragment key={itemType}>
          <div className={styles.label}>{itemType}</div>
          <div className={styles.count}>
            {world.inventory[itemType] ?? 0}
          </div>
          <MineButton itemType={itemType} />
        </Fragment>
      ))}
    </div>
  )
}
