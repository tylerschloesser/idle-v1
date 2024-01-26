import { useContext, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import invariant from 'tiny-invariant'
import { Checkbox } from './checkbox.component.js'
import { Context } from './context.js'
import { Heading3 } from './heading.component.js'
import { Select } from './select.component.js'
import { Text } from './text.component.js'
import {
  parseAssemblerRecipeItemType,
  parseFurnaceRecipeItemType,
  parseResourceType,
} from './util.js'
import styles from './world-entity.module.scss'
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
    setEntityEnabled,
    destroyEntity,
  } = useContext(Context)
  const navigate = useNavigate()
  const entity = world.entities[entityId]

  useEffect(() => {
    if (!entity) {
      navigate('../../')
    }
  }, [entity])

  if (!entity) {
    return null
  }

  return (
    <>
      <WorldMap />
      <Heading3>Entity (#{entityId})</Heading3>
      {entity?.type === EntityType.enum.Assembler && (
        <div className={styles.row}>
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
        </div>
      )}
      {entity?.type ===
        EntityType.enum.BurnerMiningDrill && (
        <div className={styles.row}>
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
        </div>
      )}
      {entity?.type === EntityType.enum.StoneFurnace && (
        <div className={styles.row}>
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
        </div>
      )}
      <div className={styles.row}>
        <Checkbox
          checked={entity.enabled}
          onChange={(checked) =>
            setEntityEnabled(entityId, checked)
          }
        >
          Enable
        </Checkbox>
      </div>
      <div className={styles.row}>
        <button
          className={styles['destroy-button']}
          onClick={() => {
            if (self.confirm('Are you sure?')) {
              destroyEntity(entityId)
            }
          }}
        >
          <Text invert bold>
            Destroy
          </Text>
        </button>
      </div>
    </>
  )
}
