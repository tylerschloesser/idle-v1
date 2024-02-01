import invariant from 'tiny-invariant'
import {
  ASSEMBLER_POWER_PER_TICK,
  BURNER_MINING_DRILL_COAL_PER_TICK,
  BURNER_MINING_DRILL_PRODUCTION_PER_TICK,
  GENERATOR_COAL_PER_TICK,
  GENERATOR_POWER_PER_TICK,
  MINE_ACTION_PRODUCTION_PER_TICK,
  STONE_FURNACE_COAL_PER_TICK,
} from './const.js'
import {
  inventoryAdd,
  inventorySub,
  iterateInventory,
  moveInventory,
} from './inventory.js'
import {
  ActionType,
  AssemblerEntity,
  BurnerMiningDrillEntity,
  Consumption,
  Entity,
  EntityId,
  EntityType,
  GeneratorEntity,
  Inventory,
  ItemType,
  Production,
  Stats,
  StoneFurnaceEntity,
  World,
} from './world.js'

function tickActionQueue(world: World): void {
  const head = world.actionQueue.at(0)
  if (!head) return

  switch (head.type) {
    case ActionType.enum.Mine: {
      invariant(head.ticksActive < head.ticksRequested)
      head.ticksActive += 1

      inventoryAdd(
        world.inventory,
        head.resourceType,
        MINE_ACTION_PRODUCTION_PER_TICK,
      )

      if (head.ticksActive === head.ticksRequested) {
        world.actionQueue.shift()
      }
      break
    }

    case ActionType.enum.Craft: {
      invariant(head.ticksRemaining > 0)
      head.ticksRemaining -= 1
      if (head.ticksRemaining === 0) {
        inventoryAdd(world.inventory, head.itemType, 1)
        world.actionQueue.shift()
      }
      break
    }
    default:
      invariant(false)
  }
}

interface EntityRequest {
  input: Inventory
  power: number
}

type PreTickFn<T extends Entity> = (
  world: World,
  entity: T,
) => EntityRequest | null

type TickFn<T extends Entity> = (
  world: World,
  entity: T,
  satisfaction: number,
  production: Production,
) => void

const preTickStoneFurnace: PreTickFn<StoneFurnaceEntity> = (
  world,
  entity,
) => {
  const recipe = world.furnaceRecipes[entity.recipeItemType]
  invariant(recipe)

  invariant(recipe.input[ItemType.enum.Coal] === undefined)
  const recipeInput = {
    ...recipe.input,
    [ItemType.enum.Coal]: STONE_FURNACE_COAL_PER_TICK,
  }

  const request: EntityRequest = {
    power: 0,
    input: {},
  }

  for (const [itemType, count] of iterateInventory(
    recipeInput,
  )) {
    request.input[itemType] = count / recipe.ticks
  }

  return request
}

const tickStoneFurnace: TickFn<StoneFurnaceEntity> = (
  world,
  entity,
  satisfaction,
  production,
) => {
  invariant(entity.recipeItemType)
  const recipe = world.furnaceRecipes[entity.recipeItemType]

  for (const [itemType, count] of iterateInventory(
    recipe.output,
  )) {
    inventoryAdd(
      production.items,
      itemType,
      (count / recipe.ticks) * satisfaction,
    )
  }
}

const preTickBurnerMiningDrill: PreTickFn<
  BurnerMiningDrillEntity
> = () => {
  const request: EntityRequest = {
    power: 0,
    input: {
      [ItemType.enum.Coal]:
        BURNER_MINING_DRILL_COAL_PER_TICK,
    },
  }

  return request
}

const tickBurnerMiningDrill: TickFn<
  BurnerMiningDrillEntity
> = (_world, entity, satisfaction, production) => {
  invariant(entity.resourceType)

  inventoryAdd(
    production.items,
    entity.resourceType,
    BURNER_MINING_DRILL_PRODUCTION_PER_TICK * satisfaction,
  )
}

const preTickAssembler: PreTickFn<AssemblerEntity> = (
  world,
  entity,
) => {
  const recipe =
    world.assemblerRecipes[entity.recipeItemType]
  invariant(recipe)

  const request: EntityRequest = {
    input: recipe.input,
    power: ASSEMBLER_POWER_PER_TICK,
  }

  return request
}

const tickAssembler: TickFn<AssemblerEntity> = (
  world,
  entity,
  satisfaction,
  production,
) => {
  const recipe =
    world.assemblerRecipes[entity.recipeItemType]
  invariant(recipe)

  if (satisfaction === 0) {
    return
  }

  for (const [itemType, count] of iterateInventory(
    recipe.output,
  )) {
    inventoryAdd(
      production.items,
      itemType,
      count * satisfaction,
    )
  }
}

const preTickGenerator: PreTickFn<GeneratorEntity> = () => {
  const request: EntityRequest = {
    power: 0,
    input: {
      [ItemType.enum.Coal]: GENERATOR_COAL_PER_TICK,
    },
  }
  return request
}

const tickGenerator: TickFn<GeneratorEntity> = (
  _world,
  _entity,
  satisfaction,
  production,
) => {
  production.power +=
    satisfaction * GENERATOR_POWER_PER_TICK
}

export function tickWorld(world: World): void {
  tickActionQueue(world)

  const requests: Record<EntityId, EntityRequest> = {}

  for (const entity of Object.values(world.entities)) {
    let request: EntityRequest | null = null
    switch (entity.type) {
      case EntityType.enum.StoneFurnace: {
        request = preTickStoneFurnace(world, entity)
        break
      }
      case EntityType.enum.BurnerMiningDrill: {
        request = preTickBurnerMiningDrill(world, entity)
        break
      }
      case EntityType.enum.Assembler: {
        request = preTickAssembler(world, entity)
        break
      }
      case EntityType.enum.Generator: {
        request = preTickGenerator(world, entity)
        break
      }
      default: {
        // TODO
      }
    }
    if (request) {
      requests[entity.id] = request
    }
  }

  const total: EntityRequest = {
    power: 0,
    input: {},
  }

  for (const request of Object.values(requests)) {
    total.power += request.power
    for (const [itemType, count] of iterateInventory(
      request.input,
    )) {
      inventoryAdd(total.input, itemType, count)
    }
  }

  const satisfaction: EntityRequest = {
    power: (() => {
      invariant(total.power >= 0)
      invariant(world.power >= 0)
      if (total.power === 0) {
        return 1
      }
      if (world.power === 0) {
        return 0
      }
      return Math.min(world.power / total.power)
    })(),
    input: {},
  }

  for (const [itemType, count] of iterateInventory(
    total.input,
  )) {
    const s = Math.min(
      (world.inventory[itemType] ?? 0) / count,
      1,
    )
    satisfaction.input[itemType] = s
  }

  // TODO add power to production/consumption
  const production: Production = {
    power: 0,
    items: {},
  }
  const consumption: Consumption = {
    power: 0,
    items: {},
  }

  for (const entity of Object.values(world.entities)) {
    const request = requests[entity.id]
    if (!request) {
      break
    }

    let s = 1
    for (const [itemType] of iterateInventory(
      request.input,
    )) {
      const ss = satisfaction.input[itemType]
      invariant(ss !== undefined)
      s = Math.min(ss, s)
    }

    if (request.power > 0) {
      s = Math.min(s, satisfaction.power)
    }

    invariant(s >= 0)
    invariant(s <= 1)
    if (s > 0) {
      for (const [itemType, count] of iterateInventory(
        request.input,
      )) {
        inventoryAdd(consumption.items, itemType, count * s)

        inventorySub(world.inventory, itemType, count * s)
      }

      switch (entity.type) {
        case EntityType.enum.StoneFurnace: {
          tickStoneFurnace(world, entity, s, production)
          break
        }
        case EntityType.enum.BurnerMiningDrill: {
          tickBurnerMiningDrill(
            world,
            entity,
            s,
            production,
          )
          break
        }
        case EntityType.enum.Assembler: {
          tickAssembler(world, entity, s, production)
          break
        }
        case EntityType.enum.Generator: {
          tickGenerator(world, entity, s, production)
          break
        }
        default: {
          invariant(false, 'TODO')
        }
      }
    }
  }

  moveInventory(production.items, world.inventory)
  updateStats(world.stats, production, consumption)

  invariant(world.power >= 0)

  world.tick += 1
  world.lastTick = new Date().toISOString()
}

function updateStats(
  stats: Stats,
  production: Production,
  consumption: Consumption,
): void {
  stats.production.pop()
  stats.production.unshift(production)
  invariant(stats.production.length === stats.window)

  stats.consumption.pop()
  stats.consumption.unshift(consumption)
  invariant(stats.consumption.length === stats.window)
}
