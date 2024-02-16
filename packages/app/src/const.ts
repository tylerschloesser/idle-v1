import invariant from 'tiny-invariant'

export const TICK_RATE: number = 100
export const TICKS_PER_SECOND: number = 1000 / TICK_RATE
invariant(TICKS_PER_SECOND === Math.floor(TICKS_PER_SECOND))

export const GENERATOR_POWER_PER_TICK = 10
export const ASSEMBLER_POWER_PER_TICK = 1

export const HAND_MINE_TICK_COUNT = 10

export const COMBUSTION_SMELTER_COAL_PER_TICK = 1 / 50
export const COMBUSTION_MINER_COAL_PER_TICK = 1 / 50
export const GENERATOR_COAL_PER_TICK = 1 / 50

// prettier-ignore
export const COMBUSTION_MINER_PRODUCTION_PER_TICK = 1 / 20
export const HAND_MINE_PRODUCTION_PER_TICK = 1 / 10

export const MINE_TICKS = 20
export const COAL_FUEL_TICKS = 50

export const CONDITION_PENALTY_PER_TICK =
  1 / (TICKS_PER_SECOND * 60 * 10) // 10 minutes
