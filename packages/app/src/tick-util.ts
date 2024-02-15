import invariant from 'tiny-invariant'
import { COMBUSTION_SMELTER_COAL_PER_TICK } from './const.js'
import {
  AssemblerRecipe,
  BufferEntity,
  CombustionSmelterEntity,
  Entity,
  EntityType,
  HandAssemblerEntity,
  ItemType,
  RecipeType,
  SmelterRecipe,
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
  entity: HandAssemblerEntity | CombustionSmelterEntity,
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
  entity: HandAssemblerEntity | CombustionSmelterEntity,
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
  satisfaction = 1,
  scale = 1,
}: {
  recipe: AssemblerRecipe | SmelterRecipe
  satisfaction?: number
  scale?: number
}): Generator<[ItemType, number]> {
  invariant(scale > 0)
  invariant(satisfaction > 0)
  invariant(satisfaction <= 1)

  for (const [itemType, count] of Object.entries(
    recipe.input,
  )) {
    yield [
      ItemType.parse(itemType),
      (count / recipe.ticks) * satisfaction * scale,
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
    satisfaction,
    scale,
  })) {
    yield value
  }
}

export function* iterateRecipeOutput({
  recipe,
  satisfaction,
  scale = 1,
}: {
  recipe: AssemblerRecipe | SmelterRecipe
  satisfaction: number
  scale?: number
}): Generator<[ItemType, number]> {
  invariant(scale > 0)
  invariant(satisfaction > 0)
  invariant(satisfaction <= 1)
  for (const [itemType, count] of Object.entries(
    recipe.output,
  )) {
    yield [
      ItemType.parse(itemType),
      (count / recipe.ticks) * satisfaction * scale,
    ]
  }
}

export function produce({
  output,
  itemType,
  count,
}: {
  output: BufferEntity
  itemType: ItemType
  count: number
}) {
  let value = output.contents[itemType]
  if (!value) {
    value = output.contents[itemType] = {
      condition: 1,
      count: 0,
    }
  }
  value.count += count
}
