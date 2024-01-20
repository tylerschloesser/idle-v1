import { useContext } from 'react'
import { Context } from './context.js'
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
    <>
      {Object.values(itemType.Values).map((itemType) => (
        <div key={itemType}>
          <div>{itemType}</div>
          <MineButton itemType={itemType} />
        </div>
      ))}
    </>
  )
}
