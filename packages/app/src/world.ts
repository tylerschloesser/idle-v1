import * as z from 'zod'

export const cellType = z.enum(['Grass1', 'Dirt1'])
export type CellType = z.infer<typeof cellType>

export const cell = z.strictObject({
  type: cellType,
})
export type Cell = z.infer<typeof cell>

export const chunk = z.strictObject({
  id: z.string(),
  cells: z.array(cell),
})
export type Chunk = z.infer<typeof chunk>

export const world = z.strictObject({
  id: z.string(),
  chunkSize: z.number(),
  chunks: z.record(z.string(), chunk),
})
export type World = z.infer<typeof world>
