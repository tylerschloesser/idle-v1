import { ItemType } from './world.js'

export function getItemColor(itemType: ItemType): string {
  switch (itemType) {
    case ItemType.enum.CopperOre:
      return 'hsl(323, 100%, 75%)'
    default:
      return 'white'
  }
}
