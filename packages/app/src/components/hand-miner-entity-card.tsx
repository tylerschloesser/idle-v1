import { useContext } from 'react'
import { useSelector } from 'react-redux'
import invariant from 'tiny-invariant'
import { WorldContext, GroupContext } from '../context.js'
import { ITEM_TYPE_TO_LABEL } from '../item-label.component.js'
import { RootState } from '../store.js'
import { Text } from '../text.component.js'
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
  const { blockId } = useContext(GroupContext)
  const world = useSelector(
    (state: RootState) => state.world,
  )
  const block = world.blocks[blockId]
  invariant(block)

  const { enqueueHandMineOperation } =
    useContext(WorldContext)

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
          extra: (
            <Text variant="b1" gray>
              {formatItemCount(
                block.resources[itemType] ?? 0,
              )}
            </Text>
          ),
        }))}
      />
    </EntityCard>
  )
}
