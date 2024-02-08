import {
  AssemblerRecipeItemType,
  ItemType,
  RecipeBook,
  RecipeType,
  SmelterRecipeItemType,
} from './world.js'

export const recipeBook: RecipeBook = {
  [SmelterRecipeItemType.enum.StoneBrick]: {
    type: RecipeType.enum.Smelter,
    ticks: 10,
    input: {
      [ItemType.enum.Stone]: 1,
    },
    output: {
      [ItemType.enum.StoneBrick]: 1,
    },
  },
  [SmelterRecipeItemType.enum.IronPlate]: {
    type: RecipeType.enum.Smelter,
    ticks: 10,
    input: {
      [ItemType.enum.IronOre]: 1,
    },
    output: {
      [ItemType.enum.IronPlate]: 1,
    },
  },
  [SmelterRecipeItemType.enum.CopperPlate]: {
    type: RecipeType.enum.Smelter,
    ticks: 10,
    input: {
      [ItemType.enum.CopperOre]: 1,
    },
    output: {
      [ItemType.enum.CopperPlate]: 1,
    },
  },
  [SmelterRecipeItemType.enum.SteelPlate]: {
    type: RecipeType.enum.Smelter,
    ticks: 100,
    input: {
      [ItemType.enum.IronPlate]: 10,
    },
    output: {
      [ItemType.enum.SteelPlate]: 1,
    },
  },
  [AssemblerRecipeItemType.enum.IronGear]: {
    type: RecipeType.enum.Assembler,
    ticks: 10,
    input: {
      [ItemType.enum.IronPlate]: 2,
    },
    output: {
      [ItemType.enum.IronGear]: 1,
    },
  },
  [AssemblerRecipeItemType.enum.CopperWire]: {
    type: RecipeType.enum.Assembler,
    ticks: 5,
    input: {
      [ItemType.enum.CopperPlate]: 1,
    },
    output: {
      [ItemType.enum.CopperWire]: 1,
    },
  },
  [AssemblerRecipeItemType.enum.ElectronicCircuit]: {
    type: RecipeType.enum.Assembler,
    ticks: 10,
    input: {
      [ItemType.enum.IronPlate]: 1,
      [ItemType.enum.CopperWire]: 1,
    },
    output: {
      [ItemType.enum.ElectronicCircuit]: 1,
    },
  },
  [AssemblerRecipeItemType.enum.RedScience]: {
    type: RecipeType.enum.Assembler,
    ticks: 20,
    input: {
      [ItemType.enum.CopperPlate]: 1,
      [ItemType.enum.IronGear]: 1,
    },
    output: {
      [ItemType.enum.RedScience]: 1,
    },
  },
  [AssemblerRecipeItemType.enum.HandMiner]: {
    type: RecipeType.enum.Assembler,
    ticks: 20,
    input: {
      [ItemType.enum.Stone]: 20,
    },
    output: {
      [ItemType.enum.HandMiner]: 1,
    },
  },
  [AssemblerRecipeItemType.enum.HandAssembler]: {
    type: RecipeType.enum.Assembler,
    ticks: 20,
    input: {
      [ItemType.enum.Stone]: 20,
      [ItemType.enum.IronPlate]: 20,
    },
    output: {
      [ItemType.enum.HandMiner]: 1,
    },
  },
  [AssemblerRecipeItemType.enum.CombustionSmelter]: {
    type: RecipeType.enum.Assembler,
    ticks: 20,
    input: {
      [ItemType.enum.Stone]: 40,
    },
    output: {
      [ItemType.enum.CombustionSmelter]: 1,
    },
  },
  [AssemblerRecipeItemType.enum.CombustionMiner]: {
    type: RecipeType.enum.Assembler,
    ticks: 20,
    input: {
      [ItemType.enum.Stone]: 40,
      [ItemType.enum.IronPlate]: 40,
    },
    output: {
      [ItemType.enum.CombustionMiner]: 1,
    },
  },
  [AssemblerRecipeItemType.enum.Generator]: {
    type: RecipeType.enum.Assembler,
    ticks: 20,
    input: {
      [ItemType.enum.IronPlate]: 40,
      [ItemType.enum.CopperWire]: 40,
      [ItemType.enum.IronGear]: 40,
    },
    output: {
      [ItemType.enum.Generator]: 1,
    },
  },
  [AssemblerRecipeItemType.enum.Assembler]: {
    type: RecipeType.enum.Assembler,
    ticks: 20,
    input: {
      [ItemType.enum.IronPlate]: 40,
      [ItemType.enum.IronGear]: 40,
      [ItemType.enum.ElectronicCircuit]: 40,
    },
    output: {
      [ItemType.enum.Assembler]: 1,
    },
  },
  [AssemblerRecipeItemType.enum.Buffer]: {
    type: RecipeType.enum.Assembler,
    ticks: 20,
    input: {
      [ItemType.enum.IronPlate]: 20,
    },
    output: {
      [ItemType.enum.Buffer]: 1,
    },
  },
}
