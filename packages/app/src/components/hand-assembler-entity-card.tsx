import { useContext } from 'react'
import invariant from 'tiny-invariant'
import { WorldContext } from '../context.js'
import { ITEM_TYPE_TO_LABEL } from '../item-label.component.js'
import { recipeBook } from '../recipe-book.js'
import {
  AssemblerRecipeItemType,
  BufferEntity,
  EntityType,
  HandAssemblerEntity,
  World,
} from '../world.js'
import {
  EntityCard,
  EntityCardProps,
} from './entity-card.js'
import { HandButtonGroup } from './hand-button-group.js'
import { HandQueue } from './hand-queue.js'
import { RecipeView } from './recipe-view.js'

function getInputBuffer(
  world: World,
  entity: HandAssemblerEntity,
): BufferEntity {
  const entityIds = Object.keys(entity.input)
  invariant(entityIds.length === 1)
  const entityId = entityIds.at(0)!
  const input = world.entities[entityId]
  invariant(input?.type === EntityType.enum.Buffer)
  return input
}

export function HandAssemblerEntityCard({
  entity,
}: EntityCardProps<HandAssemblerEntity>) {
  const {
    world,
    enqueueHandAssembleOperation,
    cancelHandAssembleOperation,
  } = useContext(WorldContext)
  const input = getInputBuffer(world, entity)
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
          AssemblerRecipeItemType.enum.HandMiner,
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
            extra: (
              <RecipeView recipe={recipe} input={input} />
            ),
          }
        })}
      />
    </EntityCard>
  )
}
