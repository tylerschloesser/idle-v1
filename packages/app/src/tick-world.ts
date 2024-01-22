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
      (inventory[ItemType.parse(itemType)] ?? 0) < count
    ) {
      return false
    }
  }
  return true
}

function hasFuel(inventory: Inventory): boolean {
  return (inventory[ItemType.enum.Coal] ?? 0) > 0
}

function decrementFuel(inventory: Inventory): void {
  const prevCount = inventory[ItemType.enum.Coal]
  invariant(prevCount)
  const nextCount = prevCount - 1
  if (nextCount > 0) {
    inventory[ItemType.enum.Coal] = nextCount
  } else {
    delete inventory[ItemType.enum.Coal]
  }
}

function decrementByRecipe(
  inventory: Inventory,
  recipe: Recipe,
): void {
  for (const [itemTypeStr, count] of Object.entries(
    recipe.input,
  )) {
    const itemType = ItemType.parse(itemTypeStr)
    const prevCount = inventory[itemType]
    invariant(prevCount)
    const nextCount = prevCount - count
    invariant(nextCount >= 0)
    if (nextCount > 0) {
      inventory[itemType] = nextCount
    } else {
      delete inventory[itemType]
    }
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

    if (entity.craftTicksRemaining === 0) {
      if (canFulfillRecipe(world.inventory, recipe)) {
        decrementByRecipe(inventory, recipe)
        entity.craftTicksRemaining = recipe.ticks
      }
    }

    if (entity.craftTicksRemaining > 0) {
      if (entity.fuelTicksRemaining === 0) {
        if (hasFuel(inventory)) {
          decrementFuel(inventory)
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
