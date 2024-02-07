import { HandAssemblerEntity } from '../world.js'
import {
  EntityCard,
  EntityCardProps,
} from './entity-card.js'

export function HandAssemblerEntityCard({
  entity,
}: EntityCardProps<HandAssemblerEntity>) {
  return (
    <EntityCard entity={entity}>
      <div>Input: {JSON.stringify(entity.input)}</div>
      <div>Output: {JSON.stringify(entity.output)}</div>
    </EntityCard>
  )
}
