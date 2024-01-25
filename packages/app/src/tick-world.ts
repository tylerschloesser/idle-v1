import invariant from 'tiny-invariant'
import { isTemplateTail } from 'typescript'
import { GENERATOR_POWER_PER_TICK } from './const.js'
import {
  canFulfillRecipe,
  decrementItem,
  decrementRecipe,
  hasItem,
  hasSpace,
  incrementItem,
  incrementItemInTick,
} from './inventory.js'
import { TickState } from './util.js'
import {
  AssemblerEntity,
  BurnerMiningDrillEntity,
  COAL_FUEL_TICKS,
  EntityType,
  GeneratorEntity,
  ItemType,
  MINE_TICKS,
  StoneFurnaceEntity,
  World,
} from './world.js'

function tickStoneFurnace(
  world: World,
  entity: StoneFurnaceEntity,
  state: TickState,
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
        incrementItemInTick(state, entity.recipeItemType, 1)
        entity.craftTicksRemaining = null
      }
    }
  }
}

function tickBurnerMiningDrill(
  world: World,
  entity: BurnerMiningDrillEntity,
  state: TickState,
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
        incrementItemInTick(state, entity.resourceType, 1)
        entity.mineTicksRemaining = null
      }
    }
  }
}

/* eslint-disable @typescript-eslint/no-unused-vars */
function tickGenerator(
  world: World,
  entity: GeneratorEntity,
  state: TickState,
): void {
  if (entity.enabled === false) {
    return
  }

  if (entity.fuelTicksRemaining === 0) {
    if (hasItem(world, ItemType.enum.Coal, 1)) {
      decrementItem(world, ItemType.enum.Coal, 1)
      entity.fuelTicksRemaining = COAL_FUEL_TICKS
    }
  }

  if (entity.fuelTicksRemaining > 0) {
    entity.fuelTicksRemaining -= 1
    state.power += GENERATOR_POWER_PER_TICK
  }
}

function tickAssembler(
  _world: World,
  _entity: AssemblerEntity,
  _state: TickState,
): void {}

/* eslint-enable @typescript-eslint/no-unused-vars */

export function tickWorld(world: World): void {
  const state: TickState = {
    inventory: {},
    power: 0,
  }

  for (const entity of Object.values(world.entities)) {
    switch (entity.type) {
      case EntityType.enum.StoneFurnace: {
        tickStoneFurnace(world, entity, state)
        break
      }
      case EntityType.enum.BurnerMiningDrill: {
        tickBurnerMiningDrill(world, entity, state)
        break
      }
      case EntityType.enum.Generator: {
        tickGenerator(world, entity, state)
        break
      }
      case EntityType.enum.Assembler: {
        tickAssembler(world, entity, state)
        break
      }
      default: {
        invariant(false)
      }
    }
  }

  mergeTickState(state, world)

  world.tick += 1
  world.lastTick = new Date().toISOString()
}

function mergeTickState(
  state: TickState,
  world: World,
): void {
  for (const [itemType, count] of Object.entries(
    state.inventory,
  )) {
    incrementItem(world, ItemType.parse(itemType), count)
  }
  world.power = state.power
}
