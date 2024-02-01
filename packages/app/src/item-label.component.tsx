import { ItemIcon } from './icon.component.js'
import styles from './item-label.module.scss'
import { Text } from './text.component.js'
import { ItemType } from './world.js'

const ITEM_TYPE_TO_LABEL = {
  [ItemType.enum.Stone]: 'Stone',
  [ItemType.enum.Coal]: 'Coal',
  [ItemType.enum.IronOre]: 'Iron Ore',
  [ItemType.enum.CopperOre]: 'Copper Ore',
  [ItemType.enum.StoneBrick]: 'Stone Brick',
  [ItemType.enum.IronPlate]: 'Iron Plate',
  [ItemType.enum.IronGear]: 'Iron Gear',
  [ItemType.enum.CopperPlate]: 'Copper Plate',
  [ItemType.enum.CopperWire]: 'Copper Wire',
  [ItemType.enum.SteelPlate]: 'Steel Plate',
  [ItemType.enum.Assembler]: 'Assembler',
  [ItemType.enum.StoneFurnace]: 'Stone Furnace',
  [ItemType.enum.BurnerMiningDrill]: 'Burner Mining Drill',
  [ItemType.enum.ElectronicCircuit]: 'Electronic Circuit',
  [ItemType.enum.RedScience]: 'Red Science',
  [ItemType.enum.Generator]: 'Generator',
  [ItemType.enum.Lab]: 'Lab',
}

export interface ItemLabelProps {
  type: ItemType
  entity?: boolean
}

export function ItemLabel({
  type,
  entity,
}: ItemLabelProps) {
  return (
    <span className={styles['item-label']}>
      <ItemIcon type={type} size="1.2em" />
      <Text variant={entity ? 'b2' : 'b1'} gray={!entity}>
        {ITEM_TYPE_TO_LABEL[type]}
      </Text>
    </span>
  )
}
