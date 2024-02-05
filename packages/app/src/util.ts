import invariant from 'tiny-invariant'
import * as z from 'zod'
import { TICK_RATE } from './const.js'
import {
  AssemblerRecipeItemType,
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
