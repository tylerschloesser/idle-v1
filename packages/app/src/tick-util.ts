import invariant from 'tiny-invariant'
import { COMBUSTION_SMELTER_COAL_PER_TICK } from './const.js'
import { gte } from './util.js'
import {
  AssemblerRecipe,
  BufferEntity,
  CombustionMinerEntity,
  CombustionSmelterEntity,
  ConsumeItemTickMetric,
  Entity,
  EntityType,
  HandAssemblerEntity,
  ItemType,
  ProduceItemTickMetric,
  SmelterRecipe,
  TickMetricType,
  World,
} from './world.js'

export function outputToEntity(
  frame: Partial<
    Record<
      ItemType,
      {
        count: number
        condition: number
      }
    >
  >,
  target: Entity,
): void {
  invariant(target.type === EntityType.enum.Buffer)

  for (const [
    itemType,
    { count, condition },
  ] of Object.entries(frame)) {
    const key = ItemType.parse(itemType)

    let value = target.contents[key]
    if (!value) {
      value = target.contents[key] = {
        count: 0,
        condition: 1,
      }
    }

    // TODO
    invariant(condition === 1)
    invariant(value.condition === 1)

    value.count += count
  }
}

export function getInputBuffer(
  world: World,
  entity:
    | HandAssemblerEntity
    | CombustionSmelterEntity
    | CombustionMinerEntity,
): BufferEntity {
  const entityIds = Object.keys(entity.input)
  invariant(entityIds.length === 1)
  const entityId = entityIds.at(0)!
  const buffer = world.entities[entityId]
  invariant(buffer?.type === EntityType.enum.Buffer)
  return buffer
}

export function getOutputBuffer(
  world: World,
  entity:
    | HandAssemblerEntity
    | CombustionSmelterEntity
    | CombustionMinerEntity,
): BufferEntity {
  const entityIds = Object.keys(entity.output)
  invariant(entityIds.length === 1)
  const entityId = entityIds.at(0)!
  const buffer = world.entities[entityId]
  invariant(buffer?.type === EntityType.enum.Buffer)
  return buffer
}

export function* iterateRecipeInput({
  recipe,
  demand = 1,
  scale = 1,
}: {
  recipe: AssemblerRecipe | SmelterRecipe
  demand?: number
  scale?: number
}): Generator<[ItemType, number]> {
  invariant(scale > 0)
  invariant(demand > 0)
  invariant(demand <= 1)

  for (const [itemType, count] of Object.entries(
    recipe.input,
  )) {
    yield [
      ItemType.parse(itemType),
      (count / recipe.ticks) * demand * scale,
    ]
  }
}

export function* iterateCombustionSmelterRecipeInput({
  entity,
  recipe,
  satisfaction = 1,
  scale = 1,
}: {
  entity: CombustionSmelterEntity
  recipe: SmelterRecipe
  satisfaction?: number
  scale?: number
}): Generator<[ItemType, number]> {
  invariant(entity.fuelType === ItemType.enum.Coal)

  yield [
    ItemType.enum.Coal,
    COMBUSTION_SMELTER_COAL_PER_TICK * scale * satisfaction,
  ]

  for (const value of iterateRecipeInput({
    recipe,
    demand: satisfaction,
    scale,
  })) {
    yield value
  }
}

export function* iterateRecipeOutput({
  recipe,
  scale = 1,
  demand = 1,
  satisfaction,
}: {
  recipe: AssemblerRecipe | SmelterRecipe
  scale?: number
  demand?: number
  satisfaction: number
}): Generator<[ItemType, number]> {
  invariant(scale > 0)
  invariant(demand > 0)
  invariant(demand <= 1)
  for (const [itemType, count] of Object.entries(
    recipe.output,
  )) {
    yield [
      ItemType.parse(itemType),
      (count / recipe.ticks) *
        demand *
        scale *
        satisfaction,
    ]
  }
}

export function consume({
  entity,
  input,
  itemType,
  count,
}: {
  entity?: Entity
  input: BufferEntity
  itemType: ItemType
  count: number
}): void {
  const value = input.contents[itemType]
  invariant(value)
  invariant(gte(value.count, count))

  value.count = Math.max(value.count - count, 0)

  if (entity) {
    const metric: ConsumeItemTickMetric = {
      type: TickMetricType.enum.ConsumeItem,
      sourceEntityId: input.id,
      itemType,
      count,
    }
    entity.metrics.at(0)!.push(metric)
  }
}

export function produce({
  entity,
  output,
  itemType,
  count,
}: {
  entity?: Entity
  output: BufferEntity
  itemType: ItemType
  count: number
}): void {
  let value = output.contents[itemType]
  if (!value) {
    value = output.contents[itemType] = {
      condition: 1,
      count: 0,
    }
  }
  value.count += count

  if (entity) {
    const metric: ProduceItemTickMetric = {
      type: TickMetricType.enum.ProduceItem,
      targetEntityId: output.id,
      itemType,
      count,
    }
    entity.metrics.at(0)!.push(metric)
  }
}

export interface EntityPreTickResult {
  consumption: {
    items: Partial<Record<ItemType, number>>
  }
}

export interface EntityTickResult {
  production: {
    items: Partial<Record<ItemType, number>>
  }
}
