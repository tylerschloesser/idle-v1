import * as z from 'zod'

export const BlockId = z.string()
export type BlockId = z.infer<typeof BlockId>

export const GroupId = z.string()
export type GroupId = z.infer<typeof GroupId>

export const EntityId = z.string()
export type EntityId = z.infer<typeof EntityId>

export const Condition = z.number().gt(0).lte(1)
export type Condition = z.infer<typeof Condition>

export const ItemType = z.enum([
  // Resources
  'Coal',
  'Stone',
  'IronOre',
  'CopperOre',

  // Intermediates
  'StoneBrick',
  'IronPlate',
  'IronGear',
  'SteelPlate',
  'CopperPlate',
  'CopperWire',
  'ElectronicCircuit',
  'RedScience',

  // Entities
  'CombustionSmelter',
  'CombustionMiner',
  'Buffer',
  'Generator',
  'Assembler',
])
export type ItemType = z.infer<typeof ItemType>

export const FuelType = z.enum([ItemType.enum.Coal])
export type FuelType = z.infer<typeof FuelType>

export const ResourceType = z.enum([
  ItemType.enum.Coal,
  ItemType.enum.Stone,
  ItemType.enum.IronOre,
  ItemType.enum.CopperOre,
])
export type ResourceType = z.infer<typeof ResourceType>

export const SmelterRecipeItemType = z.enum([
  ItemType.enum.StoneBrick,
  ItemType.enum.IronPlate,
  ItemType.enum.CopperPlate,
  ItemType.enum.SteelPlate,
])
export type SmelterRecipeItemType = z.infer<
  typeof SmelterRecipeItemType
>

export const AssemblerRecipeItemType = z.enum([
  ItemType.enum.IronGear,
  ItemType.enum.CopperWire,
  ItemType.enum.ElectronicCircuit,
  ItemType.enum.RedScience,

  ItemType.enum.CombustionSmelter,
  ItemType.enum.CombustionMiner,
  ItemType.enum.Buffer,
  ItemType.enum.Generator,
  ItemType.enum.Assembler,
])
export type AssemblerRecipeItemType = z.infer<
  typeof AssemblerRecipeItemType
>

export const InventoryKey = ItemType
export type InventoryKey = z.infer<typeof InventoryKey>

export const InventoryValue = z.strictObject({
  count: z.number().nonnegative(),
  condition: Condition,
})
export type InventoryValue = z.infer<typeof InventoryValue>

export const Inventory = z.record(
  InventoryKey,
  InventoryValue,
)
export type Inventory = z.infer<typeof Inventory>

export const RecipeInput = z.record(ItemType, z.number())
export type RecipeInput = z.infer<typeof RecipeInput>

export const RecipeOutput = RecipeInput
export type RecipeOutput = z.infer<typeof RecipeOutput>

export const RecipeType = z.enum(['Smelter', 'Assembler'])
export type RecipeType = z.infer<typeof RecipeType>

export const BaseRecipe = z.strictObject({
  ticks: z.number(),
  input: RecipeInput,
  output: RecipeOutput,
})

export const SmelterRecipe = BaseRecipe.extend({
  type: z.literal(RecipeType.enum.Assembler),
})
export type SmelterRecipe = z.infer<typeof SmelterRecipe>

export const AssemblerRecipe = BaseRecipe.extend({
  type: z.literal(RecipeType.enum.Assembler),
})
export type AssemblerRecipe = z.infer<
  typeof AssemblerRecipe
>

export const Recipe = z.discriminatedUnion('type', [
  SmelterRecipe,
  AssemblerRecipe,
])
export type Recipe = z.infer<typeof Recipe>

export const EntityType = z.enum([
  ItemType.enum.CombustionSmelter,
  ItemType.enum.CombustionMiner,
  ItemType.enum.Generator,
  ItemType.enum.Assembler,
  ItemType.enum.Buffer,
])
export type EntityType = z.infer<typeof EntityType>

const BaseEntity = z.strictObject({
  scale: z.number().int().min(1),
  condition: Condition,
  groupId: GroupId,
  input: z.record(EntityId, z.literal(true)),
  output: z.record(EntityId, z.literal(true)),
})

export const CombustionSmelterEntity = BaseEntity.extend({
  type: z.literal(EntityType.enum.CombustionSmelter),
  fuelType: FuelType,
  recipeItemType: SmelterRecipeItemType,
})
export type CombustionSmelterEntity = z.infer<
  typeof CombustionSmelterEntity
>

export const CombustionMinerEntity = BaseEntity.extend({
  type: z.literal(EntityType.enum.CombustionMiner),
  fuelType: FuelType,
  resourceType: ResourceType,
})
export type CombustionMinerEntity = z.infer<
  typeof CombustionMinerEntity
>

export const GeneratorEntity = BaseEntity.extend({
  type: z.literal(EntityType.enum.Generator),
})
export type GeneratorEntity = z.infer<
  typeof GeneratorEntity
>

export const AssemblerEntity = BaseEntity.extend({
  type: z.literal(EntityType.enum.Assembler),
  recipeItemType: AssemblerRecipeItemType,
})
export type AssemblerEntity = z.infer<
  typeof AssemblerEntity
>

export const BufferEntity = BaseEntity.extend({
  type: z.literal(EntityType.enum.Buffer),
  contents: z.record(
    ItemType,
    z.strictObject({
      count: z.number().nonnegative(),
      condition: Condition,
    }),
  ),
})

export const Entity = z.discriminatedUnion('type', [
  CombustionSmelterEntity,
  CombustionMinerEntity,
  GeneratorEntity,
  AssemblerEntity,
  BufferEntity,
])
export type Entity = z.infer<typeof Entity>

const MAJOR = 0
const MINOR = 0
const PATCH = 3

export const WORLD_VERSION = z.literal(
  `${MAJOR}.${MINOR}.${PATCH}`,
)

export const Production = z.strictObject({
  power: z.number(),
  items: Inventory,
})
export type Production = z.infer<typeof Production>

export const Consumption = Production
export type Consumption = Production

export const Stats = z.strictObject({
  window: z.literal(50),
  production: z.array(Production),
  consumption: z.array(Consumption),
})
export type Stats = z.infer<typeof Stats>

export const LogEntry = z.strictObject({
  tick: z.number(),
  message: z.string(),
})
export type LogEntry = z.infer<typeof LogEntry>

export const Group = z.strictObject({
  id: GroupId,
  blockId: BlockId,
  entityIds: z.record(EntityId, z.literal(true)),
})
export type Group = z.infer<typeof Group>

export const Block = z.strictObject({
  id: BlockId,
  groupIds: z.record(GroupId, z.literal(true)),
})
export type Block = z.infer<typeof Block>

export const World = z.strictObject({
  version: WORLD_VERSION,
  id: z.string(),
  tick: z.number(),
  lastTick: z.string().datetime(),
  inventory: Inventory,
  power: z.number(),
  stats: Stats,
  log: z.array(LogEntry),

  groups: z.record(GroupId, Group),
  entities: z.record(EntityId, Entity),

  nextEntityId: z.number().int().nonnegative(),
  nextGroupId: z.number().int().nonnegative(),
})
export type World = z.infer<typeof World>

// prettier-ignore
export const RecipeBook = z.strictObject({
  [SmelterRecipeItemType.enum.StoneBrick]: SmelterRecipe,
  [SmelterRecipeItemType.enum.IronPlate]: SmelterRecipe,
  [SmelterRecipeItemType.enum.CopperPlate]: SmelterRecipe,
  [SmelterRecipeItemType.enum.SteelPlate]: SmelterRecipe,

  [AssemblerRecipeItemType.enum.IronGear]: AssemblerRecipe,
  [AssemblerRecipeItemType.enum.CopperWire]: AssemblerRecipe,
  [AssemblerRecipeItemType.enum.ElectronicCircuit]: AssemblerRecipe,
  [AssemblerRecipeItemType.enum.RedScience]: AssemblerRecipe,

  [AssemblerRecipeItemType.enum.CombustionSmelter]: AssemblerRecipe,
  [AssemblerRecipeItemType.enum.CombustionMiner]: AssemblerRecipe,
  [AssemblerRecipeItemType.enum.Generator]: AssemblerRecipe,
  [AssemblerRecipeItemType.enum.Assembler]: AssemblerRecipe,
})
export type RecipeBook = z.infer<typeof RecipeBook>
