import invariant from 'tiny-invariant'
import {
  EntityType,
  Inventory,
  ItemType,
  Recipe,
  World,
} from './world.js'

function canFulfillRecipe(
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

function hasItem(
  inventory: Inventory,
  itemType: ItemType,
  count: number,
): boolean {
  return (inventory[itemType] ?? 0) >= count
}

function decrementItem(
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

function decrementRecipe(
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

function incrementItem(
  inventory: Inventory,
  itemType: ItemType,
): void {
  inventory[itemType] = (inventory[itemType] ?? 0) + 1
}

export function tickWorld(world: World): World {
  const { inventory } = world
  for (const entity of world.entities[
    EntityType.enum.StoneFurnace
  ] ?? []) {
    if (!entity.recipeItemType) {
      continue
    }
    const recipe =
      world.furnaceRecipes[entity.recipeItemType]
    invariant(recipe)

    invariant(entity.craftTicksRemaining >= 0)

    if (
      entity.craftTicksRemaining === 0 &&
      entity.enabled
    ) {
      if (canFulfillRecipe(world.inventory, recipe)) {
        decrementRecipe(inventory, recipe)
        entity.craftTicksRemaining = recipe.ticks
      }
    }

    if (entity.craftTicksRemaining > 0) {
      if (entity.fuelTicksRemaining === 0) {
        if (hasItem(inventory, ItemType.enum.Coal, 1)) {
          decrementItem(inventory, ItemType.enum.Coal, 1)
          entity.fuelTicksRemaining = 50
        }
      }

      if (entity.fuelTicksRemaining > 0) {
        entity.craftTicksRemaining -= 1
        entity.fuelTicksRemaining -= 1

        if (entity.craftTicksRemaining === 0) {
          incrementItem(inventory, entity.recipeItemType)
          console.debug(`crafted ${entity.recipeItemType}`)
        }
      }
    }
  }

  return {
    ...world,
    tick: world.tick + 1,
    inventory,
  }
}
