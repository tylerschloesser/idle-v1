import { useDispatch } from 'react-redux'
import { Button } from '../button.component.js'
import { useBlock } from '../context.js'
import {
  useEditEntity,
  useNewEntityConfig,
} from '../hook.js'
import { ITEM_TYPE_TO_LABEL } from '../item-label.component.js'
import {
  AppDispatch,
  HandMinerConfig,
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
  const block = useBlock()
  const dispatch = useDispatch<AppDispatch>()

  return (
    <>
      <HandQueue entity={entity} />
      <HandButtonGroup
        entityScale={entity.scale}
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
      <Edit
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
  entity: HandMinerEntity
  available: number
}

export function EditHandMiner({
  entity,
  available,
}: EditHandMinerProps) {
  const { incrementScale, decrementScale, updateEntity } =
    useEditEntity<typeof EntityType.enum.HandMiner>(
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
  entity: Pick<HandMinerEntity, 'scale'>
  updateEntity: (config: Partial<HandMinerConfig>) => void
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
