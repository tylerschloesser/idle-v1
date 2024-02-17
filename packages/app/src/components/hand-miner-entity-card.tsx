import { useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import invariant from 'tiny-invariant'
import { Button } from '../button.component.js'
import { GroupContext } from '../context.js'
import { useNewEntityConfig } from '../hook.js'
import { ITEM_TYPE_TO_LABEL } from '../item-label.component.js'
import {
  AppDispatch,
  HandMinerConfig,
  RootState,
  enqueueHandMineOperation,
} from '../store.js'
import { Text } from '../text.component.js'
import { formatItemCount } from '../util.js'
import {
  EntityType,
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

export interface NewHandMinerProps {
  available: number
}

export function NewHandMiner({
  available,
}: NewHandMinerProps) {
  const {
    entity,
    updateEntity,
    incrementScale,
    decrementScale,
    build,
  } = useNewEntityConfig<HandMinerConfig>(
    {
      type: EntityType.enum.HandMiner,
      scale: 1,
      queue: [],
    },
    available,
  )

  return (
    <>
      <EditHandMiner
        entity={entity}
        updateEntity={updateEntity}
        incrementScale={incrementScale}
        decrementScale={decrementScale}
      />
      <Button onClick={build} label="Build" />
    </>
  )
}

export interface EditHandMinerProps {
  entity: Pick<HandMinerEntity, 'scale'>
  updateEntity: (config: Partial<HandMinerConfig>) => void
  incrementScale?: () => void
  decrementScale?: () => void
}

export function EditHandMiner({
  entity,
  updateEntity,
  incrementScale,
  decrementScale,
}: EditHandMinerProps) {
  return (
    <ModifyScale
      scale={entity.scale}
      increment={incrementScale}
      decrement={decrementScale}
    />
  )
}
