import * as z from 'zod'

export const EntityId = z.string().min(1)
export type EntityId = z.infer<typeof EntityId>

export const GroupId = z.string().min(1)
export type GroupId = z.infer<typeof GroupId>

export const CellType = z.enum([
  'Grass1',
  'Dirt1',
  'Water1',
])
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

export const ItemType = z.enum([
  'Coal',
  'Stone',
  'StoneBrick',
  'IronOre',
  'IronPlate',
  'IronGear',
  'CopperOre',
  'CopperPlate',
  'CopperWire',
  'ElectronicCircuit',
  'RedScience',
])
export type ItemType = z.infer<typeof ItemType>

export const ResourceType = z.enum([
  ItemType.enum.Coal,
  ItemType.enum.Stone,
  ItemType.enum.IronOre,
  ItemType.enum.CopperOre,
])
export type ResourceType = z.infer<typeof ResourceType>

export const FurnaceRecipeItemType = z.enum([
  ItemType.enum.StoneBrick,
  ItemType.enum.IronPlate,
  ItemType.enum.CopperPlate,
])
export type FurnaceRecipeItemType = z.infer<
  typeof FurnaceRecipeItemType
>

export const AssemblerRecipeItemType = z.enum([
  ItemType.enum.IronGear,
  ItemType.enum.CopperWire,
  ItemType.enum.ElectronicCircuit,
  ItemType.enum.RedScience,
])
export type AssemblerRecipeItemType = z.infer<
  typeof AssemblerRecipeItemType
>

export const Inventory = z.record(ItemType, z.number())
export type Inventory = z.infer<typeof Inventory>

export const Recipe = z.strictObject({
  ticks: z.number(),
  input: Inventory,
})
export type Recipe = z.infer<typeof Recipe>

export const EntityType = z.enum([
  'StoneFurnace',
  'BurnerMiningDrill',
  'Generator',
  'Assembler',
  'Lab',
])
export type EntityType = z.infer<typeof EntityType>

const BaseEntity = z.strictObject({
  id: EntityId,
  groupId: GroupId,
})

export const StoneFurnaceEntity = BaseEntity.extend({
  type: z.literal(EntityType.enum.StoneFurnace),
  recipeItemType: FurnaceRecipeItemType.nullable(),
  enabled: z.boolean(),
  craftTicksRemaining: z.number().nullable(),
  fuelTicksRemaining: z.number(),
})
export type StoneFurnaceEntity = z.infer<
  typeof StoneFurnaceEntity
>

export const BurnerMiningDrillEntity = BaseEntity.extend({
  type: z.literal(EntityType.enum.BurnerMiningDrill),
  resourceType: ResourceType.nullable(),
  enabled: z.boolean(),
  mineTicksRemaining: z.number().nullable(),
  fuelTicksRemaining: z.number(),
})
export type BurnerMiningDrillEntity = z.infer<
  typeof BurnerMiningDrillEntity
>

export const GeneratorEntity = BaseEntity.extend({
  type: z.literal(EntityType.enum.Generator),
  enabled: z.boolean(),
  fuelTicksRemaining: z.number(),
})
export type GeneratorEntity = z.infer<
  typeof GeneratorEntity
>

export const AssemblerEntity = BaseEntity.extend({
  type: z.literal(EntityType.enum.Assembler),
  enabled: z.boolean(),
  recipeItemType: AssemblerRecipeItemType.nullable(),
  craftTicksRemaining: z.number().nullable(),
})
export type AssemblerEntity = z.infer<
  typeof AssemblerEntity
>

export const LabEntity = BaseEntity.extend({
  type: z.literal(EntityType.enum.Lab),
  enabled: z.boolean(),
})
export type LabEntity = z.infer<typeof LabEntity>

export const Entity = z.discriminatedUnion('type', [
  StoneFurnaceEntity,
  BurnerMiningDrillEntity,
  GeneratorEntity,
  AssemblerEntity,
  LabEntity,
])
export type Entity = z.infer<typeof Entity>

export const Group = z.strictObject({
  id: GroupId,
  entities: z.record(EntityId, Entity),
  parentId: GroupId.optional(),
  children: GroupId.array(),
})
export type Group = z.infer<typeof Group>

const MAJOR = 0
const MINOR = 0
const PATCH = 0

export const WORLD_VERSION = z.literal(
  `${MAJOR}.${MINOR}.${PATCH}`,
)

export const InventoryLimits = z.strictObject({
  [ItemType.enum.Coal]: z.number(),
  [ItemType.enum.IronOre]: z.number(),
  [ItemType.enum.IronPlate]: z.number(),
  [ItemType.enum.Stone]: z.number(),
  [ItemType.enum.StoneBrick]: z.number(),
  [ItemType.enum.IronGear]: z.number(),
  [ItemType.enum.CopperOre]: z.number(),
  [ItemType.enum.CopperPlate]: z.number(),
  [ItemType.enum.CopperWire]: z.number(),
  [ItemType.enum.ElectronicCircuit]: z.number(),
  [ItemType.enum.RedScience]: z.number(),
})
export type InventoryLimits = z.infer<
  typeof InventoryLimits
>

export const FurnaceRecipes = z.strictObject({
  [FurnaceRecipeItemType.enum.StoneBrick]: Recipe,
  [FurnaceRecipeItemType.enum.IronPlate]: Recipe,
  [FurnaceRecipeItemType.enum.CopperPlate]: Recipe,
})
export type FurnaceRecipes = z.infer<typeof FurnaceRecipes>

export const EntityRecipes = z.strictObject({
  [EntityType.enum.BurnerMiningDrill]: Recipe,
  [EntityType.enum.StoneFurnace]: Recipe,
  [EntityType.enum.Generator]: Recipe,
  [EntityType.enum.Assembler]: Recipe,
  [EntityType.enum.Lab]: Recipe,
})
export type EntityRecipes = z.infer<typeof EntityRecipes>

export const AssemblerRecipes = z.strictObject({
  [AssemblerRecipeItemType.enum.IronGear]: Recipe,
  [AssemblerRecipeItemType.enum.CopperWire]: Recipe,
  [AssemblerRecipeItemType.enum.ElectronicCircuit]: Recipe,
  [AssemblerRecipeItemType.enum.RedScience]: Recipe,
})
export type AssemblerRecipes = z.infer<
  typeof AssemblerRecipes
>

export const Stats = z.strictObject({
  window: z
    .array(
      z.strictObject({
        production: z.record(ItemType, z.number()),
        consumption: z.record(ItemType, z.number()),
        powerProduction: z.number(),
        powerConsumption: z.number(),
      }),
    )
    .length(10),
  index: z.number().min(0).max(9),
})

export const World = z.strictObject({
  version: WORLD_VERSION,
  id: z.string(),
  tick: z.number(),
  lastTick: z.string().datetime(),
  chunkSize: z.number(),
  chunks: z.record(z.string(), Chunk),
  inventory: Inventory,
  inventoryLimits: InventoryLimits,
  entityRecipes: EntityRecipes,
  furnaceRecipes: FurnaceRecipes,
  assemblerRecipes: AssemblerRecipes,
  entities: z.record(z.string(), Entity),
  nextEntityId: z.number(),
  power: z.number(),
  stats: Stats,
  groups: z.record(GroupId, Group),
})
export type World = z.infer<typeof World>

export const MINE_TICKS = 20
export const COAL_FUEL_TICKS = 50
