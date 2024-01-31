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
  ResourceType,
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
  }
}

export function buildBurnerMiningDrill(
  world: World,
  groupId: GroupId,
  resourceType: ResourceType,
): BurnerMiningDrillEntity {
  return {
    type: EntityType.enum.BurnerMiningDrill,
    id: `${world.nextEntityId++}`,
    groupId,
    resourceType,
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
  }
}

export function buildEntity(
  world: World,
  entityType: EntityType,
  groupId: GroupId,
): Entity {
  switch (entityType) {
    case EntityType.enum.Generator:
      return buildGenerator(world, groupId)
    case EntityType.enum.Assembler:
      return buildAssembler(world, groupId)
    case EntityType.enum.Lab:
      return buildLab(world, groupId)
    case EntityType.enum.BurnerMiningDrill:
    case EntityType.enum.StoneFurnace:
      invariant(false)
  }
}
