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
      onPointerUp={() => {
        addItemToInventory(itemType)
      }}
    >
      <span>Mine</span>
    </button>
  )
}
export function Mine() {
  return (
    <div className={styles.mine}>
      {Object.values(itemType.Values).map((itemType) => (
        <Fragment key={itemType}>
          <div>{itemType}</div>
          <div>0</div>
          <MineButton itemType={itemType} />
        </Fragment>
      ))}
    </div>
  )
}
