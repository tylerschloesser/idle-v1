import invariant from 'tiny-invariant'
import {
  ASSEMBLER_POWER_PER_TICK,
  BURNER_MINING_DRILL_COAL_PER_TICK,
  BURNER_MINING_DRILL_PRODUCTION_PER_TICK,
  CONDITION_PENALTY_PER_TICK,
  GENERATOR_COAL_PER_TICK,
  GENERATOR_POWER_PER_TICK,
  MINE_ACTION_PRODUCTION_PER_TICK,
  STONE_FURNACE_COAL_PER_TICK,
} from './const.js'
import {
  inventoryAdd,
  inventorySub,
  itemCountAdd,
  iterateItemCounts,
  moveInventory,
} from './inventory.js'
import { getGroup } from './util.js'
import {
  ActionType,
  AssemblerEntity,
  AssemblerRecipeItemType,
  BurnerMiningDrillEntity,
  Consumption,
  Entity,
  EntityGroup,
  EntityType,
  FurnaceRecipeItemType,
  GeneratorEntity,
  ItemType,
  Production,
  ResourceType,
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
        1,
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
        inventoryAdd(world.inventory, head.itemType, 1, 1)
        world.actionQueue.shift()
      }
      break
    }
    default:
      invariant(false)
  }
}

interface TickRequest {
  input: Partial<Record<ItemType, number>>
  power: number
  entity: Entity
}

function multiplyTickRequest(
  request: TickRequest,
  group: EntityGroup,
): void {
  for (const itemType of Object.keys(request.input)) {
    request.input[itemType as ItemType]! *= group.count
  }
  request.power *= group.count
}

function preTickStoneFurnace(
  world: World,
  entity: StoneFurnaceEntity,
): TickRequest | null {
  const group = getGroup(world, entity)
  if (group.count === 0) {
    return null
  }

  const recipe = world.furnaceRecipes[entity.recipeItemType]
  invariant(recipe.input[ItemType.enum.Coal] === undefined)

  const recipeInput = {
    ...recipe.input,
    [ItemType.enum.Coal]: STONE_FURNACE_COAL_PER_TICK,
  }

  const request: TickRequest = {
    power: 0,
    input: {},
    entity,
  }

  for (const [itemType, count] of iterateItemCounts(
    recipeInput,
  )) {
    request.input[itemType] = count / recipe.ticks
  }

  multiplyTickRequest(request, group)

  return request
}

function tickStoneFurnace(
  world: World,
  entity: StoneFurnaceEntity,
  satisfaction: number,
  production: Production,
): void {
  invariant(satisfaction > 0)
  const group = getGroup(world, entity)
  const recipe = world.furnaceRecipes[entity.recipeItemType]

  for (const [itemType, count] of iterateItemCounts(
    recipe.output,
  )) {
    inventoryAdd(
      production.items,
      itemType,
      (count / recipe.ticks) * satisfaction * group.count,
    )
  }
}

function preTickBurnerMiningDrill(
  world: World,
  entity: BurnerMiningDrillEntity,
): TickRequest | null {
  const group = getGroup(world, entity)
  if (group.count === 0) {
    return null
  }
  const request: TickRequest = {
    power: 0,
    input: {
      [ItemType.enum.Coal]:
        BURNER_MINING_DRILL_COAL_PER_TICK,
    },
    entity,
  }

  multiplyTickRequest(request, group)

  return request
}

function tickBurnerMiningDrill(
  world: World,
  entity: BurnerMiningDrillEntity,
  satisfaction: number,
  production: Production,
) {
  const group = getGroup(world, entity)
  invariant(satisfaction > 0)
  inventoryAdd(
    production.items,
    entity.resourceType,
    BURNER_MINING_DRILL_PRODUCTION_PER_TICK *
      satisfaction *
      group.count,
  )
}

function preTickAssembler(
  world: World,
  entity: AssemblerEntity,
): TickRequest | null {
  const group = getGroup(world, entity)
  if (group.count === 0) {
    return null
  }

  const recipe =
    world.assemblerRecipes[entity.recipeItemType]

  const request: TickRequest = {
    input: {},
    power: ASSEMBLER_POWER_PER_TICK,
    entity,
  }

  for (const [itemType, count] of iterateItemCounts(
    recipe.input,
  )) {
    request.input[itemType] = count / recipe.ticks
  }

  multiplyTickRequest(request, group)

  return request
}

function tickAssembler(
  world: World,
  entity: AssemblerEntity,
  satisfaction: number,
  production: Production,
): void {
  const group = getGroup(world, entity)
  invariant(satisfaction > 0)

  const recipe =
    world.assemblerRecipes[entity.recipeItemType]

  for (const [itemType, count] of iterateItemCounts(
    recipe.output,
  )) {
    inventoryAdd(
      production.items,
      itemType,
      (count / recipe.ticks) * satisfaction * group.count,
    )
  }
}

function preTickGenerator(
  world: World,
  entity: Entity,
): TickRequest | null {
  const group = getGroup(world, entity)
  if (group.count === 0) {
    return null
  }
  const request: TickRequest = {
    power: 0,
    input: {
      [ItemType.enum.Coal]: GENERATOR_COAL_PER_TICK,
    },
    entity,
  }
  multiplyTickRequest(request, group)
  return request
}

function tickGenerator(
  world: World,
  entity: GeneratorEntity,
  satisfaction: number,
  production: Production,
): void {
  const group = getGroup(world, entity)
  invariant(satisfaction > 0)
  production.power +=
    satisfaction * GENERATOR_POWER_PER_TICK * group.count
}

function* iterateTickRequests(world: World) {
  for (const recipeItemType of Object.values(
    FurnaceRecipeItemType,
  )) {
    const request = preTickStoneFurnace(world, {
      type: EntityType.enum.StoneFurnace,
      recipeItemType,
    })
    if (request) {
      yield request
    }
  }
  for (const recipeItemType of Object.values(
    AssemblerRecipeItemType,
  )) {
    const request = preTickAssembler(world, {
      type: EntityType.enum.Assembler,
      recipeItemType,
    })
    if (request) {
      yield request
    }
  }

  for (const resourceType of Object.values(ResourceType)) {
    const request = preTickBurnerMiningDrill(world, {
      type: EntityType.enum.BurnerMiningDrill,
      resourceType,
    })
    if (request) {
      yield request
    }
  }

  {
    const request = preTickGenerator(world, {
      type: EntityType.enum.Generator,
    })
    if (request) {
      yield request
    }
  }
}

export function tickWorld(world: World): void {
  tickActionQueue(world)
  const total: Omit<TickRequest, 'entity'> = {
    power: 0,
    input: {},
  }

  const requests: TickRequest[] = []
  for (const request of iterateTickRequests(world)) {
    requests.push(request)
    total.power += request.power
    for (const [itemType, count] of iterateItemCounts(
      request.input,
    )) {
      itemCountAdd(total.input, itemType, count)
    }
  }

  const satisfaction: Omit<TickRequest, 'entity'> = {
    power: (() => {
      invariant(total.power >= 0)
      invariant(world.power >= 0)
      if (total.power === 0) {
        return 1
      }
      if (world.power === 0) {
        return 0
      }
      return Math.min(world.power / total.power, 1)
    })(),
    input: {},
  }

  for (const [itemType, count] of iterateItemCounts(
    total.input,
  )) {
    const s = Math.min(
      (world.inventory[itemType]?.count ?? 0) / count,
      1,
    )
    satisfaction.input[itemType] = s
  }

  const production: Production = {
    power: 0,
    items: {},
  }
  const consumption: Consumption = {
    power: 0,
    items: {},
  }

  for (const request of requests) {
    let s = 1
    for (const [itemType] of iterateItemCounts(
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
      consumption.power += request.power * s

      for (const [itemType, count] of iterateItemCounts(
        request.input,
      )) {
        inventoryAdd(
          consumption.items,
          itemType,
          count * s,
          1,
        )
        inventorySub(world.inventory, itemType, count * s)
      }

      switch (request.entity.type) {
        case EntityType.enum.StoneFurnace: {
          tickStoneFurnace(
            world,
            request.entity,
            s,
            production,
          )
          break
        }
        case EntityType.enum.BurnerMiningDrill: {
          tickBurnerMiningDrill(
            world,
            request.entity,
            s,
            production,
          )
          break
        }
        case EntityType.enum.Assembler: {
          tickAssembler(
            world,
            request.entity,
            s,
            production,
          )
          break
        }
        case EntityType.enum.Generator: {
          tickGenerator(
            world,
            request.entity,
            s,
            production,
          )
          break
        }
        default: {
          invariant(false, 'TODO')
        }
      }

      tickEntityGroupCondition(world, request.entity)
    }
  }

  moveInventory(production.items, world.inventory)
  updateStats(world.stats, production, consumption)

  world.power = production.power
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

function tickEntityGroupCondition(
  world: World,
  entity: Entity,
): void {
  const group = getGroup(world, entity)

  invariant(group.condition > 0)
  invariant(group.condition <= 1)

  group.condition -= CONDITION_PENALTY_PER_TICK

  if (group.condition <= 0) {
    world.log.push({
      tick: world.tick,
      message: `Deleting ${group.count} ${entity.type}(s)`,
    })
    group.count = 0
    group.condition = 1
  }
}
