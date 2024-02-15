import { EntityType } from '../world.js'

export interface NewEntityCardProps {
  entityType: EntityType
  available: number
}

export function NewEntityCard({
  entityType,
  available,
}: NewEntityCardProps) {
  return (
    <>
      TODO {entityType}: {available}
    </>
  )
}
