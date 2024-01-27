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

type BuildEntityFn<T extends Entity> = (
  world: World,
  groupId: GroupId,
) => T

const buildStoneFurance: BuildEntityFn<
  StoneFurnaceEntity
> = (world, groupId) => ({
  type: EntityType.enum.StoneFurnace,
  id: `${world.nextEntityId++}`,
  groupId,
  recipeItemType: null,
  craftTicksRemaining: null,
  fuelTicksRemaining: 0,
  enabled: false,
})

const buildBurnerMiningDrill: BuildEntityFn<
  BurnerMiningDrillEntity
> = (world, groupId) => ({
  type: EntityType.enum.BurnerMiningDrill,
  id: `${world.nextEntityId++}`,
  groupId,
  enabled: false,
  mineTicksRemaining: null,
  fuelTicksRemaining: 0,
  resourceType: null,
})

const buildGenerator: BuildEntityFn<GeneratorEntity> = (
  world,
  groupId,
) => ({
  type: EntityType.enum.Generator,
  id: `${world.nextEntityId++}`,
  groupId,
  enabled: false,
  fuelTicksRemaining: 0,
})

const buildAssembler: BuildEntityFn<AssemblerEntity> = (
  world,
  groupId,
) => ({
  type: EntityType.enum.Assembler,
  id: `${world.nextEntityId++}`,
  groupId,
  enabled: false,
  recipeItemType: null,
  craftTicksRemaining: null,
})

const buildLab: BuildEntityFn<LabEntity> = (
  world,
  groupId,
) => ({
  type: EntityType.enum.Lab,
  id: `${world.nextEntityId++}`,
  groupId,
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
  groupId: GroupId,
): Entity {
  return BUILD_MAP[entityType](world, groupId)
}
