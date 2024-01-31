import {
  IconDefinition,
  faBlock,
  faBlockBrick,
  faBoreHole,
  faCircle,
  faEngine,
  faFire,
  faGear,
  faGears,
  faMicrochip,
  faMicroscope,
} from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getItemColor } from './color.js'
import { ItemType } from './world.js'

export interface ItemIconProps {
  type: ItemType
}
export function ItemIcon({ type }: ItemIconProps) {
  const color = getItemColor(type)
  let icon: IconDefinition | null = null
  switch (type) {
    case ItemType.enum.Coal:
    case ItemType.enum.Stone:
    case ItemType.enum.IronOre:
    case ItemType.enum.CopperOre:
      icon = faCircle
      break
    case ItemType.enum.IronPlate:
    case ItemType.enum.CopperPlate:
      icon = faBlock
      break
    case ItemType.enum.IronGear:
      icon = faGear
      break
    case ItemType.enum.ElectronicCircuit:
      icon = faMicrochip
      break
    case ItemType.enum.StoneFurnace:
      icon = faFire
      break
    case ItemType.enum.BurnerMiningDrill:
      icon = faBoreHole
      break
    case ItemType.enum.Generator:
      icon = faEngine
      break
    case ItemType.enum.Assembler:
      icon = faGears
      break
    case ItemType.enum.Lab:
      icon = faMicroscope
      break
    case ItemType.enum.StoneBrick:
      icon = faBlockBrick
      break
  }

  if (icon === null) return null
  return <FontAwesomeIcon icon={icon} color={color} />
}
