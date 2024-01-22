import { isInputElement } from 'react-router-dom/dist/dom.js'
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

function decrementFuel(inventory: Inventory): Inventory {
  const next = { ...inventory }
  const prevCount = next[ItemType.enum.Coal]
  invariant(prevCount)
  const nextCount = prevCount - 1
  if (nextCount > 0) {
    next[ItemType.enum.Coal] = nextCount
  } else {
    delete next[ItemType.enum.Coal]
  }
  return next
}

function decrementByRecipe(
  inventory: Inventory,
  recipe: Recipe,
): Inventory {
  const next = { ...inventory }
  for (const [itemTypeStr, count] of Object.entries(
    recipe.input,
  )) {
    const itemType = ItemType.parse(itemTypeStr)
    const prevCount = next[itemType]
    invariant(prevCount)
    const nextCount = prevCount - count
    invariant(nextCount >= 0)
    if (nextCount > 0) {
      next[itemType] = count
    } else {
      delete next[itemType]
    }
  }
  return next
}

function addItemToInventory(
  inventory: Inventory,
  itemType: ItemType,
): void {
  inventory[itemType] = (inventory[itemType] ?? 0) + 1
}

export function tickWorld(world: World): World {
  let { inventory } = world

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
        inventory = decrementByRecipe(inventory, recipe)
      }
    }

    if (entity.craftTicksRemaining > 0) {
      if (entity.fuelTicksRemaining === 0) {
        if (hasFuel(inventory)) {
          inventory = decrementFuel(inventory)
          entity.fuelTicksRemaining = 50
        }
      }

      if (entity.fuelTicksRemaining > 0) {
        entity.craftTicksRemaining -= 1
        entity.fuelTicksRemaining -= 1

        if (entity.craftTicksRemaining) {
          addItemToInventory(
            inventory,
            entity.recipeItemType,
          )
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
