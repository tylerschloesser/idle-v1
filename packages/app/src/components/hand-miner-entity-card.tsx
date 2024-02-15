import { useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import invariant from 'tiny-invariant'
import { GroupContext } from '../context.js'
import { ITEM_TYPE_TO_LABEL } from '../item-label.component.js'
import {
  AppDispatch,
  RootState,
  enqueueHandMineOperation,
  incrementEntityScale,
} from '../store.js'
import { Text } from '../text.component.js'
import { formatItemCount } from '../util.js'
import {
  EntityId,
  HandMinerEntity,
  ResourceType,
} from '../world.js'
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

export function EditHandMiner({
  entityId,
  scale,
  available,
}: {
  entityId: EntityId
  scale: number
  available: number
}) {
  const dispatch = useDispatch<AppDispatch>()
  return (
    <ModifyScale
      available={available}
      scale={scale}
      decrement={() => {
        // TODO
      }}
      increment={() => {
        dispatch(
          incrementEntityScale({
            entityId,
          }),
        )
      }}
    />
  )
}
