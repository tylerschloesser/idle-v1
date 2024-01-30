import {
  faBoreHole,
  faCircle,
  faEngine,
  faFire,
  faGear,
  faGears,
  faMicrochip,
  faMicroscope,
  faSquare,
} from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getItemColor } from './color.js'
import { ItemType } from './world.js'

export interface ItemIconProps {
  type: ItemType
}
export function ItemIcon({ type }: ItemIconProps) {
  const color = getItemColor(type)
  switch (type) {
    case ItemType.enum.Coal:
    case ItemType.enum.Stone:
    case ItemType.enum.IronOre:
    case ItemType.enum.CopperOre: {
      return (
        <FontAwesomeIcon icon={faCircle} color={color} />
      )
    }
    case ItemType.enum.IronPlate:
    case ItemType.enum.CopperPlate: {
      return (
        <FontAwesomeIcon icon={faSquare} color={color} />
      )
    }
    case ItemType.enum.IronGear: {
      return <FontAwesomeIcon icon={faGear} color={color} />
    }
    case ItemType.enum.ElectronicCircuit: {
      return (
        <FontAwesomeIcon icon={faMicrochip} color={color} />
      )
    }
    case ItemType.enum.StoneFurnace:
      return <FontAwesomeIcon icon={faFire} color={color} />
    case ItemType.enum.BurnerMiningDrill:
      return (
        <FontAwesomeIcon icon={faBoreHole} color={color} />
      )
    case ItemType.enum.Generator:
      return (
        <FontAwesomeIcon icon={faEngine} color={color} />
      )
    case ItemType.enum.Assembler:
      return (
        <FontAwesomeIcon icon={faGears} color={color} />
      )
    case ItemType.enum.Lab:
      return (
        <FontAwesomeIcon
          icon={faMicroscope}
          color={color}
        />
      )
    default:
      return null
  }
}
