import invariant from 'tiny-invariant'
import {
  AssemblerRecipe,
  BufferEntity,
  CombustionSmelterEntity,
  Entity,
  EntityType,
  HandAssemblerEntity,
  ItemType,
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

export function* iterateRecipeInput(
  recipe: AssemblerRecipe | SmelterRecipe,
  satisfaction: number = 1,
): Generator<[ItemType, number]> {
  invariant(satisfaction > 0)
  invariant(satisfaction <= 1)
  for (const [itemType, count] of Object.entries(
    recipe.input,
  )) {
    yield [
      ItemType.parse(itemType),
      (count / recipe.ticks) * satisfaction,
    ]
  }
}

export function* iterateRecipeOutput(
  recipe: AssemblerRecipe | SmelterRecipe,
  satisfaction: number,
): Generator<[ItemType, number]> {
  invariant(satisfaction > 0)
  invariant(satisfaction <= 1)
  for (const [itemType, count] of Object.entries(
    recipe.output,
  )) {
    yield [
      ItemType.parse(itemType),
      (count / recipe.ticks) * satisfaction,
    ]
  }
}
