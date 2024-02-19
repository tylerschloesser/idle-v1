import { useEditEntity } from '../hook.js'
import { GeneratorConfig } from '../store.js'
import { EntityType, GeneratorEntity } from '../world.js'
import { ModifyScale } from './modify-scale.js'

export function ViewGenerator() {
  return <>TODO</>
}

export interface EditGeneratorProps {
  entity: GeneratorEntity
  available: number
}

export function EditGenerator({
  entity,
  available,
}: EditGeneratorProps) {
  const { updateEntity, incrementScale, decrementScale } =
    useEditEntity<typeof EntityType.enum.Generator>(
      entity,
      available,
    )
  return (
    <Edit
      entity={entity}
      updateEntity={updateEntity}
      incrementScale={incrementScale}
      decrementScale={decrementScale}
    />
  )
}

interface EditProps {
  entity: Pick<GeneratorEntity, 'scale'>
  updateEntity: (config: Partial<GeneratorConfig>) => void
  incrementScale?: () => void
  decrementScale?: () => void
}

function Edit({
  entity,
  // eslint-disable-next-line
  updateEntity,
  incrementScale,
  decrementScale,
}: EditProps) {
  return (
    <ModifyScale
      scale={entity.scale}
      increment={incrementScale}
      decrement={decrementScale}
    />
  )
}
