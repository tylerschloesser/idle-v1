import {
  faBoreHole,
  faCircle,
  faEngine,
  faFire,
  faGears,
  faMicroscope,
} from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getItemColor } from './color.js'
import { EntityType, ItemType } from './world.js'

export interface ItemIconProps {
  type: ItemType
}
export function ItemIcon({ type }: ItemIconProps) {
  const color = getItemColor(type)
  return <FontAwesomeIcon icon={faCircle} color={color} />
}

export function EntityIcon({ type }: { type: EntityType }) {
  switch (type) {
    case EntityType.enum.StoneFurnace:
      return <FontAwesomeIcon icon={faFire} />
    case EntityType.enum.BurnerMiningDrill:
      return <FontAwesomeIcon icon={faBoreHole} />
    case EntityType.enum.Generator:
      return <FontAwesomeIcon icon={faEngine} />
    case EntityType.enum.Assembler:
      return <FontAwesomeIcon icon={faGears} />
    case EntityType.enum.Lab:
      return <FontAwesomeIcon icon={faMicroscope} />
  }
  return null
}
