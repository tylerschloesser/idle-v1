import { ModifyScale } from './modify-scale.js'

export interface EditCombustionSmelterProps {
  scale: number
  incrementScale?: () => void
  decrementScale?: () => void
}

export function EditCombustionSmelter({
  scale,
  incrementScale,
  decrementScale,
}: EditCombustionSmelterProps) {
  return (
    <ModifyScale
      scale={scale}
      increment={incrementScale}
      decrement={decrementScale}
    />
  )
}
