import { useContext, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import invariant from 'tiny-invariant'
import { Context } from './context.js'
import { Heading3 } from './heading.component.js'
import { Select } from './select.component.js'
import {
  parseAssemblerRecipeItemType,
  parseFurnaceRecipeItemType,
  parseResourceType,
} from './util.js'
import { WorldMap } from './world-map.component.js'
import {
  AssemblerRecipeItemType,
  EntityId,
  EntityType,
  FurnaceRecipeItemType,
  ResourceType,
} from './world.js'

export function WorldEntity() {
  const { entityId } = useParams<{ entityId: EntityId }>()
  invariant(entityId)
  const {
    world,
    setAssemblerRecipe,
    setBurnerMiningDrillResourceType,
    setStoneFurnaceRecipe,
  } = useContext(Context)
  const navigate = useNavigate()
  const entity = world.entities[entityId]

  useEffect(() => {
    if (entity === null) {
      navigate('../../')
    }
  }, [entity])

  if (entity === null) {
    return null
  }

  return (
    <>
      <WorldMap />
      <Heading3>Entity (#{entityId})</Heading3>
      {entity?.type === EntityType.enum.Assembler && (
        <>
          <Select<AssemblerRecipeItemType>
            placeholder="Choose Recipe"
            value={entity.recipeItemType}
            onChange={(itemType) => {
              setAssemblerRecipe(entity.id, itemType)
            }}
            options={Object.values(
              AssemblerRecipeItemType.enum,
            )}
            parse={parseAssemblerRecipeItemType}
          />
        </>
      )}
      {entity?.type ===
        EntityType.enum.BurnerMiningDrill && (
        <Select<ResourceType>
          placeholder="Choose Resource"
          value={entity.resourceType}
          onChange={(resourceType) => {
            setBurnerMiningDrillResourceType(
              entity.id,
              resourceType,
            )
          }}
          options={Object.values(ResourceType.enum)}
          parse={parseResourceType}
        />
      )}
      {entity?.type === EntityType.enum.StoneFurnace && (
        <Select<FurnaceRecipeItemType>
          placeholder="Choose Recipe"
          value={entity.recipeItemType}
          onChange={(itemType) => {
            setStoneFurnaceRecipe(entity.id, itemType)
          }}
          options={Object.values(
            FurnaceRecipeItemType.enum,
          )}
          parse={parseFurnaceRecipeItemType}
        />
      )}
    </>
  )
}
