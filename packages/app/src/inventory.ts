import invariant from 'tiny-invariant'
import { TickState } from './util.js'
import {
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
  return (world.inventory[itemType] ?? 0) >= count
}

export function hasSpaceInTick(
  world: World,
  state: TickState,
  itemType: ItemType,
  count: number,
): boolean {
  const existing =
    (world.inventory[itemType] ?? 0) +
    (state.inventory[itemType] ?? 0)

  return world.inventoryLimits[itemType] - existing >= count
}

export function decrementItem(
  world: World,
  itemType: ItemType,
  count: number,
  deleteIfZeroRemain: boolean = false,
): void {
  invariant(count > 0)
  const prevCount = world.inventory[itemType]
  invariant(prevCount && prevCount >= count)
  const nextCount = prevCount - count
  invariant(nextCount >= 0)

  const stat = world.stats.window[world.stats.index]
  invariant(stat)
  stat.consumption[itemType] =
    (stat.consumption[itemType] ?? 0) + count

  if (nextCount === 0 && deleteIfZeroRemain) {
    delete world.inventory[itemType]
  } else {
    world.inventory[itemType] = nextCount
  }
}

export function decrementRecipe(
  world: World,
  recipe: Recipe,
): void {
  for (const [itemType, count] of Object.entries(
    recipe.input,
  )) {
    decrementItem(world, ItemType.parse(itemType), count)
  }
}

export function incrementItem(
  world: World,
  itemType: ItemType,
  count: number,
): void {
  const stat = world.stats.window[world.stats.index]
  invariant(stat)
  stat.production[itemType] =
    (stat.production[itemType] ?? 0) + count

  world.inventory[itemType] =
    (world.inventory[itemType] ?? 0) + count
  invariant(
    world.inventory[itemType] ??
      0 <= world.inventoryLimits[itemType],
  )
}

export function incrementItemInTick(
  state: TickState,
  itemType: ItemType,
  count: number,
): void {
  state.inventory[itemType] =
    (state.inventory[itemType] ?? 0) + count
}

export function* iterateInventory(
  inventory: Inventory,
): Generator<[ItemType, number]> {
  for (const [itemType, count] of Object.entries(
    inventory,
  )) {
    yield [ItemType.parse(itemType), count]
  }
}

export function moveInventory(
  from: Inventory,
  to: Inventory,
): void {
  for (const [itemType, count] of iterateInventory(from)) {
    to[itemType] = (to[itemType] ?? 0) + count
  }
}
