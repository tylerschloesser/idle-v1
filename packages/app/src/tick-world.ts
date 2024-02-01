import invariant from 'tiny-invariant'
import {
  ASSEMBLER_POWER_PER_TICK,
  BURNER_MINING_DRILL_COAL_PER_TICK,
  BURNER_MINING_DRILL_PRODUCTION_PER_TICK,
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
  Entity,
  EntityId,
  EntityType,
  Inventory,
  ItemType,
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
  production: Inventory,
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
      production,
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
    production,
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
    power: 0,
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

  const production: Inventory = {}
  const consumption: Inventory = {}

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

    invariant(s >= 0)
    invariant(s <= 1)
    if (s > 0) {
      for (const [itemType, count] of iterateInventory(
        request.input,
      )) {
        inventoryAdd(consumption, itemType, count * s)

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
        default: {
          invariant(false, 'TODO')
        }
      }
    }
  }

  moveInventory(production, world.inventory)

  world.stats.production.pop()
  world.stats.production.unshift(production)
  invariant(
    world.stats.production.length === world.stats.window,
  )

  world.stats.consumption.pop()
  world.stats.consumption.unshift(consumption)
  invariant(
    world.stats.consumption.length === world.stats.window,
  )

  invariant(world.power >= 0)

  world.tick += 1
  world.lastTick = new Date().toISOString()
}
