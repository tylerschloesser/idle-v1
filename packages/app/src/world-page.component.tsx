import {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
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
import { tickWorld } from './tick-world.js'
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
  const worldRef = useRef<World | null>(null)

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

  useEffect(() => {
    worldRef.current = world
  }, [world])

  useEffect(() => {
    const interval = self.setInterval(() => {
      if (worldRef.current) {
        setWorld(tickWorld(worldRef.current))
      }
    }, 100)
    return () => {
      self.clearInterval(interval)
    }
  }, [])

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
        for (const entry of Object.entries(recipe.input)) {
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
              recipeItemType: null,
              craftTicksRemaining: 0,
              fuelTicksRemaining: 0,
              enabled: false,
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
    setStoneFurnaceRecipe(index, itemType) {
      setWorld((prev) => {
        invariant(prev)

        const stoneFurnaces =
          prev.entities[EntityType.enum.StoneFurnace]
        invariant(stoneFurnaces)
        const entity = stoneFurnaces.at(index)
        invariant(entity)

        if (itemType) {
          invariant(world.furnaceRecipes[itemType])
        }
        entity.recipeItemType = itemType

        stoneFurnaces[index] = { ...entity }

        return {
          ...prev,
          entities: {
            ...prev.entities,
            [EntityType.enum.StoneFurnace]: [
              ...stoneFurnaces,
            ],
          },
        }
      })
    },
    setStoneFurnaceEnabled(index, enabled) {
      setWorld((prev) => {
        invariant(prev)
        const entity =
          prev.entities[EntityType.enum.StoneFurnace]?.at(
            index,
          )
        invariant(entity)
        entity.enabled = enabled
        return { ...prev }
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
