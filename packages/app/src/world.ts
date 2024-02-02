import * as z from 'zod'

export const Condition = z.number().gt(0).lte(1)
export type Condition = z.infer<typeof Condition>

export const EntityId = z.string().min(1)
export type EntityId = z.infer<typeof EntityId>

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
  // Resources
  'Coal',
  'Stone',
  'IronOre',
  'CopperOre',

  'StoneBrick',
  'IronPlate',
  'IronGear',
  'SteelPlate',
  'CopperPlate',
  'CopperWire',
  'ElectronicCircuit',
  'RedScience',

  // Entities
  'StoneFurnace',
  'BurnerMiningDrill',
  'Generator',
  'Assembler',
  'Lab',
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
  ItemType.enum.SteelPlate,
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

export const Recipe = z.strictObject({
  ticks: z.number(),
  input: RecipeInput,
  output: RecipeOutput,
})
export type Recipe = z.infer<typeof Recipe>

export const EntityType = z.enum([
  ItemType.enum.StoneFurnace,
  ItemType.enum.BurnerMiningDrill,
  ItemType.enum.Generator,
  ItemType.enum.Assembler,
  ItemType.enum.Lab,
])
export type EntityType = z.infer<typeof EntityType>

const BaseEntity = z.strictObject({
  id: EntityId,
  condition: Condition,
})

export const StoneFurnaceEntity = BaseEntity.extend({
  type: z.literal(EntityType.enum.StoneFurnace),
  recipeItemType: FurnaceRecipeItemType,
})
export type StoneFurnaceEntity = z.infer<
  typeof StoneFurnaceEntity
>

export const BurnerMiningDrillEntity = BaseEntity.extend({
  type: z.literal(EntityType.enum.BurnerMiningDrill),
  resourceType: ResourceType,
})
export type BurnerMiningDrillEntity = z.infer<
  typeof BurnerMiningDrillEntity
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

export const LabEntity = BaseEntity.extend({
  type: z.literal(EntityType.enum.Lab),
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

export const BuildEntity = z.discriminatedUnion('type', [
  StoneFurnaceEntity.omit({
    id: true,
    condition: true,
  }),
  BurnerMiningDrillEntity.omit({
    id: true,
    condition: true,
  }),
  GeneratorEntity.omit({
    id: true,
    condition: true,
  }),
  AssemblerEntity.omit({
    id: true,
    condition: true,
  }),
  LabEntity.omit({
    id: true,
    condition: true,
  }),
])
export type BuildEntity = z.infer<typeof BuildEntity>

const MAJOR = 0
const MINOR = 0
const PATCH = 2

export const WORLD_VERSION = z.literal(
  `${MAJOR}.${MINOR}.${PATCH}`,
)

export const FurnaceRecipes = z.strictObject({
  [FurnaceRecipeItemType.enum.StoneBrick]: Recipe,
  [FurnaceRecipeItemType.enum.IronPlate]: Recipe,
  [FurnaceRecipeItemType.enum.CopperPlate]: Recipe,
  [FurnaceRecipeItemType.enum.SteelPlate]: Recipe,
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

export const ActionType = z.enum(['Mine', 'Craft'])
export type ActionType = z.infer<typeof ActionType>

export const MineAction = z.strictObject({
  type: z.literal(ActionType.enum.Mine),
  resourceType: ResourceType,
  ticksActive: z.number(),
  ticksRequested: z.number(),
})
export type MineAction = z.infer<typeof MineAction>

export const CraftAction = z.strictObject({
  type: z.literal(ActionType.enum.Craft),
  itemType: ItemType,
  ticksRemaining: z.number(),
})
export type CraftAction = z.infer<typeof CraftAction>

export const Action = z.discriminatedUnion('type', [
  MineAction,
  CraftAction,
])
export type Action = z.infer<typeof Action>

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

export const World = z.strictObject({
  version: WORLD_VERSION,
  id: z.string(),
  tick: z.number(),
  lastTick: z.string().datetime(),
  chunkSize: z.number(),
  chunks: z.record(z.string(), Chunk),
  inventory: Inventory,
  entityRecipes: EntityRecipes,
  furnaceRecipes: FurnaceRecipes,
  assemblerRecipes: AssemblerRecipes,
  entities: z.record(z.string(), Entity),
  nextEntityId: z.number(),
  power: z.number(),
  actionQueue: z.array(Action),
  stats: Stats,
  log: z.array(LogEntry),
})
export type World = z.infer<typeof World>
