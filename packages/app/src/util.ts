import invariant from 'tiny-invariant'
import * as z from 'zod'

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
