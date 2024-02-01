import {
  IconDefinition,
  faBlock,
  faBlockBrick,
  faBoreHole,
  faCircleC,
  faCircleI,
  faCircleS,
  faEngine,
  faFire,
  faFlask,
  faGear,
  faGears,
  faMicrochip,
  faMicroscope,
  faReel,
} from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getItemColor } from './color.js'
import { ItemType } from './world.js'

export interface ItemIconProps {
  type: ItemType
  size?: string
  className?: string
}
export function ItemIcon({
  type,
  size,
  className,
}: ItemIconProps) {
  const color = getItemColor(type)
  let icon: IconDefinition | null = null
  switch (type) {
    case ItemType.enum.Coal:
      icon = faCircleC
      break
    case ItemType.enum.Stone:
      icon = faCircleS
      break
    case ItemType.enum.IronOre:
      icon = faCircleI
      break
    case ItemType.enum.CopperOre:
      icon = faCircleC
      break
    case ItemType.enum.CopperWire:
      icon = faReel
      break
    case ItemType.enum.IronPlate:
    case ItemType.enum.CopperPlate:
    case ItemType.enum.SteelPlate:
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
    case ItemType.enum.RedScience:
      icon = faFlask
      break
  }

  if (icon === null) return null
  return (
    <FontAwesomeIcon
      icon={icon}
      color={color}
      fixedWidth
      fontSize={size}
      className={className}
    />
  )
}
