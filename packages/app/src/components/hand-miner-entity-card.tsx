import { useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import invariant from 'tiny-invariant'
import { GroupContext } from '../context.js'
import { ITEM_TYPE_TO_LABEL } from '../item-label.component.js'
import {
  AppDispatch,
  RootState,
  enqueueHandMineOperation,
} from '../store.js'
import { Text } from '../text.component.js'
import { formatItemCount } from '../util.js'
import { HandMinerEntity, ResourceType } from '../world.js'
import { HandButtonGroup } from './hand-button-group.js'
import { HandQueue } from './hand-queue.js'
import { ModifyScale } from './modify-scale.js'

export function HandMinerEntityCard({
  entity,
}: {
  entity: HandMinerEntity
}) {
  const { blockId } = useContext(GroupContext)
  const world = useSelector(
    (state: RootState) => state.world,
  )
  const block = world.blocks[blockId]
  invariant(block)

  const dispatch = useDispatch<AppDispatch>()

  return (
    <>
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
            dispatch(
              enqueueHandMineOperation({
                entityId: entity.id,
                resourceType: itemType,
              }),
            )
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
    </>
  )
}

export interface EditHandMinerProps {
  scale: number
  incrementScale?: () => void
  decrementScale?: () => void
}

export function EditHandMiner({
  scale,
  incrementScale,
  decrementScale,
}: EditHandMinerProps) {
  return (
    <ModifyScale
      scale={scale}
      increment={incrementScale}
      decrement={decrementScale}
    />
  )
}
