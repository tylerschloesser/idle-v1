import * as z from 'zod'

export const CellType = z.enum(['Grass1', 'Dirt1'])
export type CellType = z.infer<typeof CellType>

export const Cell = z.strictObject({
  type: CellType,
})
export type Cell = z.infer<typeof Cell>

export const Chunk = z.strictObject({
  id: z.string(),
  cells: z.array(Cell),
})
export type Chunk = z.infer<typeof Chunk>

export const ItemType = z.enum(['Coal', 'Stone'])
export type ItemType = z.infer<typeof ItemType>

export const Inventory = z.record(ItemType, z.number())
export type Inventory = z.infer<typeof Inventory>

export const Recipe = Inventory
export type Recipe = z.infer<typeof Recipe>

export const EntityType = z.enum(['StoneFurnace'])
export type EntityType = z.infer<typeof EntityType>

export const StoneFurnaceEntity = z.strictObject({
  type: z.literal(EntityType.enum.StoneFurnace),
})
export type StoneFurnaceEntity = z.infer<
  typeof StoneFurnaceEntity
>

export const Entity = z.discriminatedUnion('type', [
  StoneFurnaceEntity,
])
export type Entity = z.infer<typeof Entity>

export const World = z.strictObject({
  id: z.string(),
  chunkSize: z.number(),
  chunks: z.record(z.string(), Chunk),
  inventory: Inventory,
  entityRecipes: z.record(EntityType, Recipe),
  entities: z.record(EntityType, z.array(Entity)),
})
export type World = z.infer<typeof World>
