import invariant from 'tiny-invariant'
import {
  AssemblerEntity,
  BurnerMiningDrillEntity,
  Entity,
  EntityType,
  FurnaceRecipeItemType,
  GeneratorEntity,
  GroupId,
  LabEntity,
  StoneFurnaceEntity,
  World,
} from './world.js'

export function buildStoneFurance(
  world: World,
  groupId: GroupId,
  recipeItemType: FurnaceRecipeItemType,
): StoneFurnaceEntity {
  return {
    type: EntityType.enum.StoneFurnace,
    id: `${world.nextEntityId++}`,
    groupId,
    recipeItemType,
    enabled: true,
  }
}

function buildBurnerMiningDrill(
  world: World,
  groupId: GroupId,
): BurnerMiningDrillEntity {
  return {
    type: EntityType.enum.BurnerMiningDrill,
    id: `${world.nextEntityId++}`,
    groupId,
    enabled: false,
    resourceType: null,
  }
}

function buildGenerator(
  world: World,
  groupId: GroupId,
): GeneratorEntity {
  return {
    type: EntityType.enum.Generator,
    id: `${world.nextEntityId++}`,
    groupId,
    enabled: false,
  }
}

function buildAssembler(
  world: World,
  groupId: GroupId,
): AssemblerEntity {
  return {
    type: EntityType.enum.Assembler,
    id: `${world.nextEntityId++}`,
    groupId,
    enabled: false,
    recipeItemType: null,
  }
}

function buildLab(
  world: World,
  groupId: GroupId,
): LabEntity {
  return {
    type: EntityType.enum.Lab,
    id: `${world.nextEntityId++}`,
    groupId,
    enabled: false,
  }
}

export function buildEntity(
  world: World,
  entityType: EntityType,
  groupId: GroupId,
): Entity {
  switch (entityType) {
    case EntityType.enum.BurnerMiningDrill:
      return buildBurnerMiningDrill(world, groupId)
    case EntityType.enum.Generator:
      return buildGenerator(world, groupId)
    case EntityType.enum.Assembler:
      return buildAssembler(world, groupId)
    case EntityType.enum.Lab:
      return buildLab(world, groupId)
    case EntityType.enum.StoneFurnace:
      invariant(false)
  }
}
