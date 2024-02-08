import { ITEM_TYPE_TO_LABEL } from '../item-label.component.js'
import { HandAssemblerEntity, ItemType } from '../world.js'
import {
  EntityCard,
  EntityCardProps,
} from './entity-card.js'
import { HandButtonGroup } from './hand-button-group.js'
import { HandQueue } from './hand-queue.js'

export function HandAssemblerEntityCard({
  entity,
}: EntityCardProps<HandAssemblerEntity>) {
  return (
    <EntityCard entity={entity}>
      <HandQueue entity={entity} />
      <HandButtonGroup
        buttons={[
          ItemType.enum.CombustionSmelter,
          ItemType.enum.CombustionMiner,
          ItemType.enum.Assembler,
        ].map((itemType) => ({
          key: itemType,
          itemType,
          label: ITEM_TYPE_TO_LABEL[itemType],
          onClick: () => {
            console.log('todo')
          },
        }))}
      />
    </EntityCard>
  )
}
