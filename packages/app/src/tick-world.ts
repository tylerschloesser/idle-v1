import invariant from 'tiny-invariant'
import { STONE_FURNACE_COAL_PER_TICK } from './const.js'
import {
  incrementItem,
  iterateInventory,
} from './inventory.js'
import {
  ActionType,
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

interface EntityRequest {
  input: Inventory
  energy: number
}

type PreTickFn<T extends Entity> = (
  world: World,
  entity: T,
) => EntityRequest | null

type TickFn<T extends Entity> = (
  world: World,
  entity: T,
  satisfaction: number | null,
) => void

const preTickStoneFurnace: PreTickFn<StoneFurnaceEntity> = (
  world,
  entity,
) => {
  if (!entity.recipeItemType) {
    return null
  }

  const recipe = world.furnaceRecipes[entity.recipeItemType]
  invariant(recipe)

  invariant(recipe.input[ItemType.enum.Coal] === undefined)
  const recipeInput = {
    ...recipe.input,
    [ItemType.enum.Coal]: STONE_FURNACE_COAL_PER_TICK,
  }

  const request: EntityRequest = {
    energy: 0,
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
  satisfaction: number | null,
) => {
  if (!entity.recipeItemType) {
    invariant(satisfaction === null)
    return
  }

  invariant(satisfaction !== null)

  const recipe = world.furnaceRecipes[entity.recipeItemType]

  for (const [itemType, count] of iterateInventory(
    recipe.output,
  )) {
    world.inventory[itemType] =
      (world.inventory[itemType] ?? 0) +
      count * satisfaction
  }
}

export function tickWorld(world: World): void {
  tickActionQueue(world)

  const requests: Record<EntityId, EntityRequest> = {}

  for (const entity of Object.values(world.entities)) {
    switch (entity.type) {
      case EntityType.enum.StoneFurnace: {
        const request = preTickStoneFurnace(world, entity)
        if (request) {
          requests[entity.id] = request
        }
        break
      }
      default: {
        // TODO
      }
    }
  }

  const total: EntityRequest = {
    energy: 0,
    input: {},
  }

  for (const request of Object.values(requests)) {
    total.energy += request.energy
    for (const [itemType, count] of iterateInventory(
      request.input,
    )) {
      total.input[itemType] =
        (total.input[itemType] ?? 0) + count
    }
  }

  const satisfaction: EntityRequest = {
    energy: 0,
    input: {},
  }

  for (const [itemType, count] of iterateInventory(
    total.input,
  )) {
    const s = Math.max(
      (world.inventory[itemType] ?? 0) / count,
      1,
    )
    satisfaction.input[itemType] = s
  }

  for (const entity of Object.values(world.entities)) {
    switch (entity.type) {
      case EntityType.enum.StoneFurnace: {
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

        for (const [itemType, count] of iterateInventory(
          request.input,
        )) {
          let current = world.inventory[itemType]
          invariant(current !== undefined)
          current -= count * s
          invariant(current >= 0)
          world.inventory[itemType] = current
        }

        tickStoneFurnace(world, entity, s)

        break
      }
      default: {
        // TODO
      }
    }
  }

  invariant(world.power >= 0)

  world.tick += 1
  world.lastTick = new Date().toISOString()
}
