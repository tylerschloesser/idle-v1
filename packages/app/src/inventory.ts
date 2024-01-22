import invariant from 'tiny-invariant'
import { Inventory, ItemType, Recipe } from './world.js'

export function canFulfillRecipe(
  inventory: Inventory,
  recipe: Recipe,
): boolean {
  for (const [itemType, count] of Object.entries(
    recipe.input,
  )) {
    if (
      !hasItem(inventory, ItemType.parse(itemType), count)
    ) {
      return false
    }
  }
  return true
}

export function hasItem(
  inventory: Inventory,
  itemType: ItemType,
  count: number,
): boolean {
  return (inventory[itemType] ?? 0) >= count
}

export function decrementItem(
  inventory: Inventory,
  itemType: ItemType,
  count: number,
  deleteIfZeroRemain: boolean = false,
): void {
  invariant(count > 0)
  const prevCount = inventory[itemType]
  invariant(prevCount && prevCount >= count)
  const nextCount = prevCount - count
  invariant(nextCount >= 0)

  if (nextCount === 0 && deleteIfZeroRemain) {
    delete inventory[itemType]
  } else {
    inventory[itemType] = nextCount
  }
}

export function decrementRecipe(
  inventory: Inventory,
  recipe: Recipe,
): void {
  for (const [itemType, count] of Object.entries(
    recipe.input,
  )) {
    decrementItem(
      inventory,
      ItemType.parse(itemType),
      count,
    )
  }
}

export function incrementItem(
  inventory: Inventory,
  itemType: ItemType,
): void {
  inventory[itemType] = (inventory[itemType] ?? 0) + 1
}
