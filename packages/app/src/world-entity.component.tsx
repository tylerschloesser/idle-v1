import { useContext, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import invariant from 'tiny-invariant'
import { Context } from './context.js'
import { Heading3 } from './heading.component.js'
import { Select } from './select.component.js'
import { Text } from './text.component.js'
import { parseAssemblerRecipeItemType } from './util.js'
import styles from './world-entity.module.scss'
import {
  AssemblerRecipeItemType,
  EntityId,
  EntityType,
} from './world.js'

export function WorldEntity() {
  const { entityId } = useParams<{ entityId: EntityId }>()
  invariant(entityId)
  const { world, setAssemblerRecipe, destroyEntity } =
    useContext(Context)
  const navigate = useNavigate()
  const entity = world.entities[entityId]

  useEffect(() => {
    if (!entity) {
      navigate('..')
    }
  }, [entity])

  if (!entity) {
    return null
  }

  return (
    <>
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
