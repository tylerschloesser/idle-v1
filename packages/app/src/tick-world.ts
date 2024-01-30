import invariant from 'tiny-invariant'
import {
  ASSEMBLER_POWER_PER_TICK,
  GENERATOR_POWER_PER_TICK,
  STONE_FURNACE_COAL_PER_TICK,
} from './const.js'
import { EntityIcon } from './icon.component.js'
import {
  canFulfillRecipe,
  decrementItem,
  decrementRecipe,
  hasItem,
  hasSpaceInTick,
  incrementItem,
  incrementItemInTick,
  iterateInventory,
} from './inventory.js'
import { TickState } from './util.js'
import {
  ActionType,
  AssemblerEntity,
  BurnerMiningDrillEntity,
  COAL_FUEL_TICKS,
  EntityType,
  GeneratorEntity,
  Inventory,
  ItemType,
  LabEntity,
  MINE_TICKS,
  Recipe,
  StoneFurnaceEntity,
  World,
} from './world.js'

function tryTickRecipe(
  recipe: Recipe,
  input: Inventory,
  output: Inventory,
): void {
  let isInputFulfilled = true
  for (const [itemType, count] of iterateInventory(
    recipe.input,
  )) {
    if ((input[itemType] ?? 0) < count / recipe.ticks) {
      isInputFulfilled = false
      break
    }
  }

  let isFuelFulfilled = true
  if (
    (input[ItemType.enum.Coal] ?? 0) <
    STONE_FURNACE_COAL_PER_TICK
  ) {
    isFuelFulfilled = false
  }

  if (
    isInputFulfilled === false ||
    isFuelFulfilled === false
  ) {
    return
  }

  for (const [itemType, count] of iterateInventory(
    recipe.input,
  )) {
    let nextCount = input[itemType]
    invariant(nextCount !== undefined)
    nextCount -= count / recipe.ticks
    invariant(nextCount >= 0)
    input[itemType] = nextCount
  }

  let nextCoal = input[ItemType.enum.Coal]
  invariant(nextCoal !== undefined)
  nextCoal -= STONE_FURNACE_COAL_PER_TICK
  invariant(nextCoal >= 0)
  input[ItemType.enum.Coal] = nextCoal

  for (const [itemType, count] of iterateInventory(
    recipe.output,
  )) {
    output[itemType] =
      (output[itemType] ?? 0) + count / recipe.ticks
  }
}

function moveOutputToInventory(
  output: Inventory,
  inventory: Inventory,
): void {
  for (const [itemType, count] of iterateInventory(
    output,
  )) {
    if (count >= 1) {
      inventory[itemType] =
        (inventory[itemType] ?? 0) + Math.floor(count)
      output[itemType] = count - Math.floor(count)
    }
  }
}

function tickStoneFurnace(
  world: World,
  entity: StoneFurnaceEntity,
): void {
  if (!entity.recipeItemType) {
    return
  }
  const recipe = world.furnaceRecipes[entity.recipeItemType]
  invariant(recipe)

  tryTickRecipe(recipe, entity.input, entity.output)
  moveOutputToInventory(entity.output, world.inventory)
}

function tickBurnerMiningDrill(
  world: World,
  entity: BurnerMiningDrillEntity,
): void {
  if (!entity.resourceType) {
    return
  }

  const recipe = world.furnaceRecipes[entity.recipeItemType]
  invariant(recipe)

  tryTickRecipe(recipe, entity.input, entity.output)
  moveOutputToInventory(entity.output, world.inventory)
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

function tickActionQueue(world: World): void {
  const head = world.actionQueue.at(0)
  if (!head) return

  switch (head.type) {
    case ActionType.enum.Mine: {
      invariant(head.ticksRemaining > 0)
      head.ticksRemaining -= 1
      if (head.ticksRemaining === 0) {
        incrementItem(world, head.resourceType, 1)
        world.actionQueue.shift()
      }
      break
    }
    default:
      invariant(false)
  }
}

export function tickWorld(world: World): void {
  tickActionQueue(world)

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
