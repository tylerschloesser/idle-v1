import { useContext } from 'react'
import { Context } from '../context.js'
import { ITEM_TYPE_TO_LABEL } from '../item-label.component.js'
import {
  AssemblerRecipeItemType,
  HandAssemblerEntity,
} from '../world.js'
import {
  EntityCard,
  EntityCardProps,
} from './entity-card.js'
import { HandButtonGroup } from './hand-button-group.js'
import { HandQueue } from './hand-queue.js'

export function HandAssemblerEntityCard({
  entity,
}: EntityCardProps<HandAssemblerEntity>) {
  const { enqueueHandAssembleOperation } =
    useContext(Context)
  return (
    <EntityCard entity={entity}>
      <HandQueue entity={entity} />
      <HandButtonGroup
        buttons={[
          AssemblerRecipeItemType.enum.CombustionSmelter,
          AssemblerRecipeItemType.enum.CombustionMiner,
          AssemblerRecipeItemType.enum.Assembler,
        ].map((itemType) => ({
          key: itemType,
          itemType,
          label: ITEM_TYPE_TO_LABEL[itemType],
          onClick: () => {
            enqueueHandAssembleOperation(
              entity.id,
              itemType,
            )
          },
        }))}
      />
    </EntityCard>
  )
}
