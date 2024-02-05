import invariant from 'tiny-invariant'

export const TICK_RATE: number = 100
export const TICKS_PER_SECOND: number = 1000 / TICK_RATE
invariant(TICKS_PER_SECOND === Math.floor(TICKS_PER_SECOND))

export const GENERATOR_POWER_PER_TICK = 10
export const ASSEMBLER_POWER_PER_TICK = 1

export const MINE_ACTION_TICKS = 10

export const STONE_FURNACE_COAL_PER_TICK = 1 / 50
export const BURNER_MINING_DRILL_COAL_PER_TICK = 1 / 50
export const GENERATOR_COAL_PER_TICK = 1 / 50

export const BURNER_MINING_DRILL_PRODUCTION_PER_TICK =
  1 / 10 + Number.EPSILON

export const HAND_MINE_PRODUCTION_PER_TICK =
  1 / 10 + Number.EPSILON

export const MINE_TICKS = 20
export const COAL_FUEL_TICKS = 50

export const CONDITION_PENALTY_PER_TICK =
  1 / (TICKS_PER_SECOND * 60 * 10) // 10 minutes
