import { faCircle } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getItemColor } from './color.js'
import { ItemType } from './world.js'

export interface ItemIconProps {
  type: ItemType
}
export function ItemIcon({ type }: ItemIconProps) {
  const color = getItemColor(type)
  return <FontAwesomeIcon icon={faCircle} color={color} />
}
