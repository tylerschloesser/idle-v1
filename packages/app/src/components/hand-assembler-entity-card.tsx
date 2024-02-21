import { useDispatch } from 'react-redux'
import invariant from 'tiny-invariant'
import { Heading3 } from '../heading.component.js'
import { useEditEntity } from '../hook.js'
import { ITEM_TYPE_TO_LABEL } from '../item-label.component.js'
import { recipeBook } from '../recipe-book.js'
import {
  AppDispatch,
  HandAssemblerConfig,
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
import { ModifyScale } from './modify-scale.js'
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
      <Heading3>Entities</Heading3>
      <HandButtonGroup
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
              <RecipeView recipe={recipe} input={input} />
            ),
          }
        })}
      />
      <Heading3>Intermediates</Heading3>
      <HandButtonGroup
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
              <RecipeView recipe={recipe} input={input} />
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
