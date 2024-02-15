import { useDispatch } from 'react-redux'
import invariant from 'tiny-invariant'
import { ITEM_TYPE_TO_LABEL } from '../item-label.component.js'
import { recipeBook } from '../recipe-book.js'
import {
  AppDispatch,
  cancelHandAssembleOperation,
  enqueueHandAssembleOperation,
  useWorld,
} from '../store.js'
import {
  AssemblerRecipeItemType,
  BufferEntity,
  EntityType,
  HandAssemblerEntity,
  World,
} from '../world.js'
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
}: {
  entity: HandAssemblerEntity
}) {
  const world = useWorld()
  const input = getInputBuffer(world, entity)

  const dispatch = useDispatch<AppDispatch>()

  return (
    <>
      <HandQueue
        entity={entity}
        cancel={(itemId) => {
          dispatch(
            cancelHandAssembleOperation({
              entityId: entity.id,
              itemId,
            }),
          )
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
              dispatch(
                enqueueHandAssembleOperation({
                  entityId: entity.id,
                  entityType: itemType,
                }),
              )
            },
            extra: (
              <RecipeView recipe={recipe} input={input} />
            ),
          }
        })}
      />
    </>
  )
}
