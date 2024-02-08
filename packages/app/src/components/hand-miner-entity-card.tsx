import { useContext } from 'react'
import { Context } from '../context.js'
import { HomeContext } from '../home-context.js'
import { ITEM_TYPE_TO_LABEL } from '../item-label.component.js'
import { formatItemCount } from '../util.js'
import { HandMinerEntity, ResourceType } from '../world.js'
import {
  EntityCard,
  EntityCardProps,
} from './entity-card.js'
import { HandButtonGroup } from './hand-button-group.js'
import { HandQueue } from './hand-queue.js'

export function HandMinerEntityCard({
  entity,
}: EntityCardProps<HandMinerEntity>) {
  const { block } = useContext(HomeContext)
  const { enqueueHandMineOperation } = useContext(Context)
  return (
    <EntityCard entity={entity}>
      <HandQueue entity={entity} />
      <HandButtonGroup
        buttons={[
          ResourceType.enum.Coal,
          ResourceType.enum.Stone,
          ResourceType.enum.IronOre,
          ResourceType.enum.CopperOre,
        ].map((itemType) => ({
          key: itemType,
          itemType,
          onClick: () => {
            enqueueHandMineOperation(entity.id, itemType)
          },
          label: ITEM_TYPE_TO_LABEL[itemType],
          extra: formatItemCount(
            block.resources[itemType] ?? 0,
          ),
        }))}
      />
    </EntityCard>
  )
}
