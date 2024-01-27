import {
  AssemblerEntity,
  BurnerMiningDrillEntity,
  Entity,
  EntityType,
  GeneratorEntity,
  GroupId,
  LabEntity,
  StoneFurnaceEntity,
  World,
} from './world.js'

type BuildEntityFn<T extends Entity> = (world: World) => T

const ROOT_GROUP_ID: GroupId = '0'

const buildStoneFurance: BuildEntityFn<
  StoneFurnaceEntity
> = (world) => ({
  type: EntityType.enum.StoneFurnace,
  id: `${world.nextEntityId++}`,
  groupId: ROOT_GROUP_ID,
  recipeItemType: null,
  craftTicksRemaining: null,
  fuelTicksRemaining: 0,
  enabled: false,
})

const buildBurnerMiningDrill: BuildEntityFn<
  BurnerMiningDrillEntity
> = (world) => ({
  type: EntityType.enum.BurnerMiningDrill,
  id: `${world.nextEntityId++}`,
  groupId: ROOT_GROUP_ID,
  enabled: false,
  mineTicksRemaining: null,
  fuelTicksRemaining: 0,
  resourceType: null,
})

const buildGenerator: BuildEntityFn<GeneratorEntity> = (
  world,
) => ({
  type: EntityType.enum.Generator,
  id: `${world.nextEntityId++}`,
  groupId: ROOT_GROUP_ID,
  enabled: false,
  fuelTicksRemaining: 0,
})

const buildAssembler: BuildEntityFn<AssemblerEntity> = (
  world,
) => ({
  type: EntityType.enum.Assembler,
  id: `${world.nextEntityId++}`,
  groupId: ROOT_GROUP_ID,
  enabled: false,
  recipeItemType: null,
  craftTicksRemaining: null,
})

const buildLab: BuildEntityFn<LabEntity> = (world) => ({
  type: EntityType.enum.Lab,
  id: `${world.nextEntityId++}`,
  groupId: ROOT_GROUP_ID,
  enabled: false,
})

const BUILD_MAP: Record<
  EntityType,
  BuildEntityFn<Entity>
> = {
  [EntityType.enum.StoneFurnace]: buildStoneFurance,
  [EntityType.enum.BurnerMiningDrill]:
    buildBurnerMiningDrill,
  [EntityType.enum.Generator]: buildGenerator,
  [EntityType.enum.Assembler]: buildAssembler,
  [EntityType.enum.Lab]: buildLab,
}

export function buildEntity(
  world: World,
  entityType: EntityType,
): Entity {
  return BUILD_MAP[entityType](world)
}
