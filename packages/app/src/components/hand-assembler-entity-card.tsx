import { useContext } from 'react'
import { Context } from '../context.js'
import { ITEM_TYPE_TO_LABEL } from '../item-label.component.js'
import { recipeBook } from '../recipe-book.js'
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
import { RecipeView } from './recipe-view.js'

export function HandAssemblerEntityCard({
  entity,
}: EntityCardProps<HandAssemblerEntity>) {
  const {
    enqueueHandAssembleOperation,
    cancelHandAssembleOperation,
  } = useContext(Context)
  return (
    <EntityCard entity={entity}>
      <HandQueue
        entity={entity}
        cancel={(itemId) => {
          cancelHandAssembleOperation(entity.id, itemId)
        }}
      />
      <HandButtonGroup
        buttons={[
          AssemblerRecipeItemType.enum.CombustionSmelter,
          AssemblerRecipeItemType.enum.CombustionMiner,
          AssemblerRecipeItemType.enum.Assembler,
        ].map((itemType) => {
          const recipe = recipeBook[itemType]
          return {
            key: itemType,
            itemType,
            label: ITEM_TYPE_TO_LABEL[itemType],
            onClick: () => {
              enqueueHandAssembleOperation(
                entity.id,
                itemType,
              )
            },
            extra: <RecipeView recipe={recipe} />,
          }
        })}
      />
    </EntityCard>
  )
}
