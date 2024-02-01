import invariant from 'tiny-invariant'
import {
  Condition,
  Inventory,
  ItemType,
  Recipe,
  World,
} from './world.js'

export function canFulfillRecipe(
  world: World,
  recipe: Recipe,
): boolean {
  for (const [itemType, count] of Object.entries(
    recipe.input,
  )) {
    if (!hasItem(world, ItemType.parse(itemType), count)) {
      return false
    }
  }
  return true
}

export function hasItem(
  world: World,
  itemType: ItemType,
  count: number,
): boolean {
  return (world.inventory[itemType]?.count ?? 0) >= count
}

export function* iterateItemCounts(
  record: Partial<Record<ItemType, number>>,
): Generator<[ItemType, number]> {
  for (const [itemType, count] of Object.entries(record)) {
    yield [ItemType.parse(itemType), count]
  }
}

export function itemCountAdd(
  itemCount: Partial<Record<ItemType, number>>,
  itemType: ItemType,
  count: number,
): void {
  itemCount[itemType] = (itemCount[itemType] ?? 0) + count
}

export function* iterateInventory(
  inventory: Inventory,
): Generator<[ItemType, number, Condition]> {
  for (const [
    itemType,
    { count, condition },
  ] of Object.entries(inventory)) {
    yield [ItemType.parse(itemType), count, condition]
  }
}

export function inventorySub(
  inventory: Inventory,
  itemType: ItemType,
  count: number,
): void {
  const value = inventory[itemType]
  invariant(value)

  value.count -= count

  // accommodate floating point inprecision
  invariant(value.count > -Number.EPSILON)

  value.count = Math.max(value.count, 0)
}

export function inventorySubRecipe(
  inventory: Inventory,
  recipe: Recipe,
): void {
  for (const [itemType, count] of iterateItemCounts(
    recipe.input,
  )) {
    inventorySub(inventory, itemType, count)
  }
}

export function inventoryAdd(
  inventory: Inventory,
  itemType: ItemType,
  count: number,
  condition: Condition,
): void {
  invariant(count >= 0)
  if (count === 0) {
    return
  }

  let value = inventory[itemType]
  if (!value) {
    value = inventory[itemType] = {
      condition: 1,
      count: 0,
    }
  }
  invariant(value.count >= 0)

  value.condition =
    (value.condition * value.count) /
      (value.count + count) +
    (condition * count) / (value.count + count)

  Condition.parse(value.condition)

  value.count += count
}

export function countInventory(
  inventory: Inventory,
  itemType: ItemType,
): number {
  return inventory[itemType]?.count ?? 0
}

export function moveInventory(
  source: Inventory,
  target: Inventory,
): void {
  for (const [
    itemType,
    count,
    condition,
  ] of iterateInventory(source)) {
    inventoryAdd(target, itemType, count, condition)
  }
}
