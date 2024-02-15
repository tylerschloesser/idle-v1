import { ModifyScale } from './modify-scale.js'

export interface EditCombustionSmelterProps {
  scale: number
  available: number
  incrementScale(): void
  decrementScale(): void
}

export function EditCombustionSmelter({
  scale,
  available,
  incrementScale,
  decrementScale,
}: EditCombustionSmelterProps) {
  return (
    <ModifyScale
      available={available}
      scale={scale}
      increment={incrementScale}
      decrement={decrementScale}
    />
  )
}
