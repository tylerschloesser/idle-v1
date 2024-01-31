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
  // Resources
  'Coal',
  'Stone',
  'IronOre',
  'CopperOre',

  'StoneBrick',
  'IronPlate',
  'IronGear',
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
  output: Inventory,
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
  groupId: GroupId,
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
  resourceType: ResourceType.nullable(),
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
  recipeItemType: AssemblerRecipeItemType.nullable(),
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

export const Group = z.strictObject({
  id: GroupId,
  entities: z.record(EntityId, Entity),
  parentId: GroupId.optional(),
  children: GroupId.array(),
})
export type Group = z.infer<typeof Group>

const MAJOR = 0
const MINOR = 0
const PATCH = 1

export const WORLD_VERSION = z.literal(
  `${MAJOR}.${MINOR}.${PATCH}`,
)

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

export const ActionType = z.enum(['Mine', 'Craft'])
export type ActionType = z.infer<typeof ActionType>

export const MineAction = z.strictObject({
  type: z.literal(ActionType.enum.Mine),
  resourceType: ResourceType,
  ticksRemaining: z.number(),
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

export const Satisfaction = z.strictObject({
  energy: z.number(),
  input: Inventory,
})
export type Satisfaction = z.infer<typeof Satisfaction>

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
  groups: z.record(GroupId, Group),
  actionQueue: z.array(Action),
  satisfaction: Satisfaction,
})
export type World = z.infer<typeof World>
