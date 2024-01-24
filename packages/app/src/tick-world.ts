import invariant from 'tiny-invariant'
import {
  canFulfillRecipe,
  decrementItem,
  decrementRecipe,
  hasItem,
  hasSpace,
  incrementItem,
} from './inventory.js'
import {
  BurnerMiningDrillEntity,
  COAL_FUEL_TICKS,
  EntityType,
  ItemType,
  MINE_TICKS,
  StoneFurnaceEntity,
  World,
} from './world.js'

function tickStoneFurnace(
  world: World,
  entity: StoneFurnaceEntity,
): void {
  if (!entity.recipeItemType) {
    return
  }
  const recipe = world.furnaceRecipes[entity.recipeItemType]
  invariant(recipe)

  if (
    entity.craftTicksRemaining === null &&
    entity.enabled
  ) {
    if (canFulfillRecipe(world, recipe)) {
      decrementRecipe(world, recipe)
      entity.craftTicksRemaining = recipe.ticks
    }
  }

  if (entity.craftTicksRemaining !== null) {
    invariant(entity.craftTicksRemaining >= 0)

    if (entity.craftTicksRemaining > 0) {
      if (entity.fuelTicksRemaining === 0) {
        if (hasItem(world, ItemType.enum.Coal, 1)) {
          decrementItem(world, ItemType.enum.Coal, 1)
          entity.fuelTicksRemaining = COAL_FUEL_TICKS
        }
      }

      if (entity.fuelTicksRemaining > 0) {
        entity.craftTicksRemaining -= 1
        entity.fuelTicksRemaining -= 1
      }
    }

    if (entity.craftTicksRemaining === 0) {
      if (hasSpace(world, entity.recipeItemType, 1)) {
        incrementItem(world, entity.recipeItemType, 1)
        entity.craftTicksRemaining = null
      }
    }
  }
}

function tickBurnerMiningDrill(
  world: World,
  entity: BurnerMiningDrillEntity,
): void {
  if (!entity.resourceType) {
    return
  }

  invariant(entity.fuelTicksRemaining >= 0)

  if (
    entity.mineTicksRemaining === null &&
    entity.enabled
  ) {
    entity.mineTicksRemaining = MINE_TICKS
  }

  if (entity.mineTicksRemaining !== null) {
    invariant(entity.mineTicksRemaining >= 0)

    if (entity.mineTicksRemaining > 0) {
      if (entity.fuelTicksRemaining === 0) {
        if (hasItem(world, ItemType.enum.Coal, 1)) {
          decrementItem(world, ItemType.enum.Coal, 1)
          entity.fuelTicksRemaining = COAL_FUEL_TICKS
        }
      }

      if (entity.fuelTicksRemaining > 0) {
        entity.mineTicksRemaining -= 1
        entity.fuelTicksRemaining -= 1
      }
    }

    if (entity.mineTicksRemaining === 0) {
      if (hasSpace(world, entity.resourceType, 1)) {
        incrementItem(world, entity.resourceType, 1)
        entity.mineTicksRemaining = null
      }
    }
  }
}

export function tickWorld(world: World): void {
  for (const entity of Object.values(world.entities)) {
    switch (entity.type) {
      case EntityType.enum.StoneFurnace: {
        tickStoneFurnace(world, entity)
        break
      }
      case EntityType.enum.BurnerMiningDrill: {
        tickBurnerMiningDrill(world, entity)
        break
      }
      default: {
        invariant(false)
      }
    }
  }

  world.tick += 1
  world.lastTick = new Date().toISOString()
}
