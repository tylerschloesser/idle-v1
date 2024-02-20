import { ItemType } from './world.js'

export function getItemColor(itemType: ItemType): string {
  switch (itemType) {
    case ItemType.enum.CopperOre:
    case ItemType.enum.CopperPlate:
    case ItemType.enum.CopperWire:
      return 'hsl(0, 50%, 75%)'
    case ItemType.enum.IronOre:
    case ItemType.enum.IronPlate:
    case ItemType.enum.IronGear:
      return 'hsl(180, 25%, 75%)'
    case ItemType.enum.Stone:
    case ItemType.enum.StoneBrick:
    case ItemType.enum.SteelPlate:
      return 'hsl(0, 0%, 75%)'
    case ItemType.enum.Coal:
      return 'hsl(0, 0%, 25%)'
    case ItemType.enum.ElectronicCircuit:
      return 'hsl(120, 75%, 75%)'
    case ItemType.enum.RedScience:
      return 'hsl(0, 100%, 75%)'
    case ItemType.enum.Power:
      return 'hsl(60, 100%, 75%)'
    default:
      return 'white'
  }
}
