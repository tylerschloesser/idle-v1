import { ItemType } from './world.js'

export function getItemColor(itemType: ItemType): string {
  switch (itemType) {
    case ItemType.enum.CopperOre:
    case ItemType.enum.CopperPlate:
      return 'hsl(0, 100%, 75%)'
    case ItemType.enum.IronOre:
    case ItemType.enum.IronPlate:
      return 'hsl(180, 25%, 75%)'
    case ItemType.enum.Stone:
      return 'hsl(0, 0%, 75%)'
    case ItemType.enum.Coal:
      return 'hsl(0, 0%, e5%)'
    default:
      return 'white'
  }
}
