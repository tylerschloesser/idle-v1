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

export const itemType = z.enum(['Coal', 'Stone'])
export type ItemType = z.infer<typeof itemType>

export const inventory = z.record(itemType, z.number())
export type Inventory = z.infer<typeof inventory>

export const recipe = inventory
export type Recipe = z.infer<typeof recipe>

export const entityType = z.enum(['StoneFurnace'])
export type EntityType = z.infer<typeof entityType>

export const stoneFurnaceEntity = z.strictObject({
  type: z.literal(entityType.enum.StoneFurnace),
})
export type StoneFurnaceEntity = z.infer<
  typeof stoneFurnaceEntity
>

export const entity = z.discriminatedUnion('type', [
  stoneFurnaceEntity,
])
export type Entity = z.infer<typeof entity>

export const world = z.strictObject({
  id: z.string(),
  chunkSize: z.number(),
  chunks: z.record(z.string(), chunk),
  inventory,
  recipes: z.record(entityType, recipe),
})
export type World = z.infer<typeof world>
