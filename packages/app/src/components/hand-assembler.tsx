import { useDispatch } from 'react-redux'
import { useBlock } from '../context.js'
import { Heading3 } from '../heading.component.js'
import { useEditEntity } from '../hook.js'
import { ITEM_TYPE_TO_LABEL } from '../item-label.component.js'
import { recipeBook } from '../recipe-book.js'
import {
  AppDispatch,
  HandAssemblerConfig,
  cancelHandAssembleOperation,
  enqueueHandAssembleOperation,
} from '../store.js'
import {
  AssemblerRecipeItemType,
  EntityType,
  HandAssemblerEntity,
} from '../world.js'
import { HandButtonGroup } from './hand-button-group.js'
import { HandQueue } from './hand-queue.js'
import { ModifyScale } from './modify-scale.js'
import { RecipeView } from './recipe-view.js'

export function ViewHandAssembler({
  entity,
}: {
  entity: HandAssemblerEntity
}) {
  const block = useBlock()
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
      <Heading3>Entities</Heading3>
      <HandButtonGroup
        entityScale={entity.scale}
        buttons={[
          AssemblerRecipeItemType.enum.CombustionSmelter,
          AssemblerRecipeItemType.enum.CombustionMiner,
          AssemblerRecipeItemType.enum.HandMiner,
          AssemblerRecipeItemType.enum.HandAssembler,
          AssemblerRecipeItemType.enum.Generator,
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
              <RecipeView recipe={recipe} block={block} />
            ),
          }
        })}
      />
      <Heading3>Intermediates</Heading3>
      <HandButtonGroup
        entityScale={entity.scale}
        buttons={[
          AssemblerRecipeItemType.enum.CopperWire,
          AssemblerRecipeItemType.enum.IronGear,
          AssemblerRecipeItemType.enum.ElectronicCircuit,
          AssemblerRecipeItemType.enum.RedScience,
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
              <RecipeView recipe={recipe} block={block} />
            ),
          }
        })}
      />
    </>
  )
}

export interface EditHandAssemblerProps {
  entity: HandAssemblerEntity
  available: number
}

export function EditHandAssembler({
  entity,
  available,
}: EditHandAssemblerProps) {
  const { incrementScale, decrementScale, updateEntity } =
    useEditEntity<typeof EntityType.enum.HandAssembler>(
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
  entity: Pick<HandAssemblerEntity, 'scale'>
  updateEntity: (
    config: Partial<HandAssemblerConfig>,
  ) => void
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
