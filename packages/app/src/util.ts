import invariant from 'tiny-invariant'
import * as z from 'zod'
import {
  AssemblerRecipeItemType,
  FurnaceRecipeItemType,
  Inventory,
  ResourceType,
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
