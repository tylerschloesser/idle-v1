import invariant from 'tiny-invariant'
import {
  canFulfillRecipe,
  decrementItem,
  decrementRecipe,
  hasItem,
  incrementItem,
} from './inventory.js'
import {
  EntityType,
  ItemType,
  StoneFurnaceEntity,
  World,
} from './world.js'

function tickStoneFurnace(
  world: World,
  entity: StoneFurnaceEntity,
): void {
  const { inventory } = world
  if (!entity.recipeItemType) {
    return
  }
  const recipe = world.furnaceRecipes[entity.recipeItemType]
  invariant(recipe)

  invariant(entity.craftTicksRemaining >= 0)

  if (entity.craftTicksRemaining === 0 && entity.enabled) {
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

export function tickWorld(world: World): World {
  const { inventory } = world
  for (const entity of Object.values(world.entities)) {
    switch (entity.type) {
      case EntityType.enum.StoneFurnace: {
        tickStoneFurnace(world, entity)
        break
      }
      default: {
        invariant(false)
      }
    }
  }

  return {
    ...world,
    tick: world.tick + 1,
    inventory,
  }
}
