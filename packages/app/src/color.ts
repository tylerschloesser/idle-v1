import { ItemType } from './world.js'

export function getItemColor(itemType: ItemType): string {
  switch (itemType) {
    case ItemType.enum.CopperOre:
      return 'hsl(0, 100%, 75%)'
    case ItemType.enum.IronOre:
      return 'hsl(180, 25%, 75%)'
    case ItemType.enum.Stone:
      return 'hsl(0, 0%, 75%)'
    case ItemType.enum.Coal:
      return 'hsl(0, 0%, 25%)'
    default:
      return 'white'
  }
}
