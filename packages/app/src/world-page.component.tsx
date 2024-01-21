import {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react'
import {
  Outlet,
  useNavigate,
  useParams,
} from 'react-router-dom'
import invariant from 'tiny-invariant'
import { Context, IContext } from './context.js'
import { TabBar } from './tab-bar.component.js'
import {
  generateWorld,
  loadWorld,
  saveWorld,
} from './world-api.js'
import styles from './world-page.module.scss'
import {
  Entity,
  ItemType,
  World,
  EntityType,
} from './world.js'

function useWorld(): [
  World | null,
  Dispatch<SetStateAction<World | null>>,
] {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  useEffect(() => {
    if (id) return
    navigate('/world/test', { replace: true })
  }, [id])

  const [world, setWorld] = useState<World | null>(null)

  useEffect(() => {
    if (!id) return
    loadWorld(id).then((world) => {
      if (world) {
        setWorld(world)
      } else {
        generateWorld(id).then(setWorld)
      }
    })
  }, [id])

  useEffect(() => {
    if (world) {
      saveWorld(world)
    }
  }, [world])

  return [world, setWorld]
}

export function WorldPage() {
  const [world, setWorld] = useWorld()

  if (world === null) {
    return null
  }

  const context: IContext = {
    world,
    addItemToInventory(itemType) {
      setWorld((prev) => {
        invariant(prev)
        return {
          ...prev,
          inventory: {
            ...prev.inventory,
            [itemType]: (prev.inventory[itemType] ?? 0) + 1,
          },
        }
      })
    },
    buildEntity(entityType) {
      setWorld((prev) => {
        invariant(prev)
        const recipe = prev.entityRecipes[entityType]
        const inventory = { ...prev.inventory }
        invariant(recipe)
        for (const entry of Object.entries(recipe)) {
          let count = inventory[entry[0] as ItemType]
          invariant(
            typeof count === 'number' && count >= entry[1],
          )
          count -= entry[1]
          invariant(count >= 0)
          if (count > 0) {
            inventory[entry[0] as ItemType] = count
          } else {
            delete inventory[entry[0] as ItemType]
          }
        }

        let entity: Entity
        switch (entityType) {
          case EntityType.enum.StoneFurnace: {
            entity = {
              type: EntityType.enum.StoneFurnace,
            }
          }
        }

        const entities = {
          ...prev.entities,
          [entityType]: [
            ...(prev.entities[entityType] ?? []),
            entity,
          ],
        }

        return { ...prev, inventory, entities }
      })
    },
  }

  return (
    <div className={styles['world-page']}>
      <Context.Provider value={context}>
        <Outlet />
        <TabBar />
      </Context.Provider>
    </div>
  )
}
