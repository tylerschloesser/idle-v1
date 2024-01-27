import invariant from 'tiny-invariant'
import { LabeledStatement } from 'typescript'
import {
  ASSEMBLER_POWER_PER_TICK,
  GENERATOR_POWER_PER_TICK,
} from './const.js'
import {
  canFulfillRecipe,
  decrementItem,
  decrementRecipe,
  hasItem,
  hasSpaceInTick,
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
  LabEntity,
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
      if (
        hasSpaceInTick(
          world,
          state,
          entity.recipeItemType,
          1,
        )
      ) {
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
      if (
        hasSpaceInTick(world, state, entity.resourceType, 1)
      ) {
        incrementItemInTick(state, entity.resourceType, 1)
        entity.mineTicksRemaining = null
      }
    }
  }
}

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
  world: World,
  entity: AssemblerEntity,
  state: TickState,
): void {
  if (
    entity.enabled === false ||
    entity.recipeItemType === null
  ) {
    return
  }

  const recipe =
    world.assemblerRecipes[entity.recipeItemType]

  if (
    entity.craftTicksRemaining === null &&
    canFulfillRecipe(world, recipe)
  ) {
    decrementRecipe(world, recipe)
    entity.craftTicksRemaining = recipe.ticks
  }

  if (entity.craftTicksRemaining === null) {
    return
  }

  invariant(entity.craftTicksRemaining >= 0)

  if (entity.craftTicksRemaining > 0) {
    if (world.power < ASSEMBLER_POWER_PER_TICK) {
      return
    }

    world.power -= ASSEMBLER_POWER_PER_TICK
    entity.craftTicksRemaining -= 1
  }

  if (entity.craftTicksRemaining === 0) {
    if (
      hasSpaceInTick(world, state, entity.recipeItemType, 1)
    ) {
      incrementItemInTick(state, entity.recipeItemType, 1)
      entity.craftTicksRemaining = null
    }
  }
}

/* eslint-disable @typescript-eslint/no-unused-vars */
function tickLab(
  _world: World,
  _entity: LabEntity,
  _state: TickState,
): void {}
/* eslint-enable @typescript-eslint/no-unused-vars */

export function tickWorld(world: World): void {
  const state: TickState = {
    inventory: {},
    power: 0,
  }

  const stat = world.stats.window[world.stats.index]
  invariant(stat)
  for (const itemType of Object.values(ItemType.enum)) {
    stat.consumption[itemType] = 0
    stat.production[itemType] = 0
  }
  stat.powerProduction = 0
  stat.powerConsumption = 0

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
      case EntityType.enum.Lab: {
        tickLab(world, entity, state)
        break
      }
      default: {
        invariant(false)
      }
    }
  }

  invariant(world.power >= 0)

  mergeTickState(state, world)

  world.tick += 1
  world.lastTick = new Date().toISOString()

  world.stats.index = (world.stats.index + 1) % 10
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
