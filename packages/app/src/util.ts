import invariant from 'tiny-invariant'
import * as z from 'zod'
import { TICK_RATE } from './const.js'
import {
  AssemblerRecipeItemType,
  Block,
  EntityType,
  ItemType,
  ResourceType,
  SmelterRecipeItemType,
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

export function parseResourceType(
  data: unknown,
): ResourceType {
  return ResourceType.parse(data)
}

export function parseSmelterRecipeItemType(
  data: unknown,
): SmelterRecipeItemType {
  return SmelterRecipeItemType.parse(data)
}

export function parseAssemblerRecipeItemType(
  data: unknown,
): AssemblerRecipeItemType {
  return AssemblerRecipeItemType.parse(data)
}

export function formatItemCount(count: number): string {
  count += Number.EPSILON

  if (count < 1000) {
    return `${Math.floor(count)}`
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

export function formatSatisfaction(satisfaction: number) {
  if (satisfaction < 10) {
    return `${Math.floor(satisfaction * 100)}%`
  } else {
    return `${Math.floor((satisfaction * 100) / 1000)}k%`
  }
}

export function clamp(
  value: number,
  min: number,
  max: number,
): number {
  return Math.min(max, Math.max(value, min))
}

export function ticksToTime(ticks: number): string {
  const seconds = (ticks * TICK_RATE) / 1000
  if (seconds < 60) {
    return `${seconds.toFixed(1)} second(s)`
  }
  const minutes = seconds / 60
  if (minutes < 60) {
    return `${minutes.toFixed(1)} minute(s)`
  }

  const hours = minutes / 60
  if (hours < 24) {
    return `${hours.toFixed(1)} hour(s)`
  }

  const days = hours / 24
  return `${days.toFixed(1)} day(s)`
}

export function isEntityType(
  itemType: ItemType,
): itemType is EntityType {
  return EntityType.safeParse(itemType).success
}

export function* iterateBlockItems(
  block: Block,
): Generator<
  [itemType: ItemType, { condition: number; count: number }]
> {
  for (const [key, value] of Object.entries(block.items)) {
    yield [ItemType.parse(key), value]
  }
}

export function mapItems<
  T extends { count: number } = { count: number },
>(
  items: Partial<Record<ItemType, T>>,
  cb: (itemType: ItemType, item: T) => JSX.Element,
): JSX.Element[] {
  return Object.entries(items).map(([key, value]) =>
    cb(ItemType.parse(key), value),
  )
}

export function gte(a: number, b: number): boolean {
  return a - b >= -Number.EPSILON
}

export function* iterateItems(
  items: Partial<Record<ItemType, number>>,
): Generator<[ItemType, number]> {
  for (const [key, value] of Object.entries(items)) {
    yield [ItemType.parse(key), value]
  }
}
