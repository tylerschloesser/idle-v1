import invariant from 'tiny-invariant'
import * as z from 'zod'
import {
  AssemblerRecipeItemType,
  Entity,
  EntityGroup,
  EntityGroupType,
  EntityType,
  FurnaceRecipeItemType,
  Inventory,
  ResourceType,
  World,
} from './world.js'

export function getIsoDiffMs(
  start: string,
  end: string = new Date().toISOString(),
): number {
  invariant(z.string().datetime().parse(start))
  invariant(z.string().datetime().parse(end))

  const elapsed =
    new Date(end).getTime() - new Date(start).getTime()
  invariant(elapsed >= 0)

  return elapsed
}

export interface TickState {
  inventory: Inventory
  power: number
}

export function parseResourceType(
  data: unknown,
): ResourceType {
  return ResourceType.parse(data)
}

export function parseFurnaceRecipeItemType(
  data: unknown,
): FurnaceRecipeItemType {
  return FurnaceRecipeItemType.parse(data)
}

export function parseAssemblerRecipeItemType(
  data: unknown,
): AssemblerRecipeItemType {
  return AssemblerRecipeItemType.parse(data)
}

export function formatItemCount(count: number) {
  if (count < 1000) {
    return count.toFixed(0)
  }
  count /= 1000
  if (count < 1000) {
    if (count > 10) {
      return `${count.toFixed(0)}k`
    } else {
      return `${count.toFixed(1)}k`
    }
  }
  count /= 1000
  if (count < 1000) {
    if (count > 10) {
      return `${count.toFixed(0)}m`
    } else {
      return `${count.toFixed(1)}m`
    }
  }
  count /= 1000
  if (count > 10) {
    return `${count.toFixed(1)}b`
  } else {
    return `${count.toFixed(0)}b`
  }
}

export function clamp(
  value: number,
  min: number,
  max: number,
): number {
  return Math.min(max, Math.max(value, min))
}

export function getGroup(
  world: World,
  entity: Entity,
): EntityGroup {
  const group = (() => {
    // prettier-ignore
    switch (entity.type) {
      case EntityType.enum.StoneFurnace:
        return world.groups[EntityGroupType.enum.StoneFurnace][entity.recipeItemType]
      case EntityType.enum.BurnerMiningDrill:
        return world.groups[EntityGroupType.enum.BurnerMiningDrill][entity.resourceType]
      case EntityType.enum.Assembler:
        return world.groups[EntityGroupType.enum.Assembler][entity.recipeItemType]
      case EntityType.enum.Generator:
      case EntityType.enum.Lab:
        return world.groups[EntityGroupType.enum.Other][entity.type]
    }
  })()
  invariant(group)
  return group
}
