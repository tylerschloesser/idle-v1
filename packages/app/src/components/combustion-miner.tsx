import { ModifyScale } from './modify-scale.js'

export interface EditCombustionMinerProps {
  scale: number
  incrementScale?: () => void
  decrementScale?: () => void
}

export function EditCombustionMiner({
  scale,
  incrementScale,
  decrementScale,
}: EditCombustionMinerProps) {
  return (
    <ModifyScale
      scale={scale}
      increment={incrementScale}
      decrement={decrementScale}
    />
  )
}
