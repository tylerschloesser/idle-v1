import { ItemIcon } from './icon.component.js'
import styles from './item-label.module.scss'
import { Text } from './text.component.js'
import { ItemType } from './world.js'

export const ITEM_TYPE_TO_LABEL = {
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
  [ItemType.enum.ElectronicCircuit]: 'Electronic Circuit',
  [ItemType.enum.RedScience]: 'Red Science',

  [ItemType.enum.Power]: 'Power',

  [ItemType.enum.HandMiner]: 'Hand Miner',
  [ItemType.enum.HandAssembler]: 'Hand Assembler',
  [ItemType.enum.CombustionSmelter]: 'Combustion Smelter',
  [ItemType.enum.CombustionMiner]: 'Combustion Miner',
  [ItemType.enum.Assembler]: 'Assembler',
  [ItemType.enum.Generator]: 'Generator',
}

export interface ItemLabelProps {
  type: ItemType
}

export function ItemLabel({ type }: ItemLabelProps) {
  return (
    <span className={styles['item-label']}>
      <ItemIcon
        type={type}
        size="1.2em"
        className={styles['item-icon']}
      />
      <Text variant={'b2'}>{ITEM_TYPE_TO_LABEL[type]}</Text>
    </span>
  )
}
