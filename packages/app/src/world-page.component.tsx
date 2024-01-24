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
import { TICK_RATE } from './const.js'
import { Context, IContext } from './context.js'
import {
  decrementRecipe,
  incrementItem,
} from './inventory.js'
import { TabBar } from './tab-bar.component.js'
import { tickWorld } from './tick-world.js'
import {
  generateWorld,
  loadWorld,
  saveWorld,
} from './world-api.js'
import styles from './world-page.module.scss'
import { Entity, EntityType, World } from './world.js'

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
        tickWorld(worldRef.current)
        setWorld({ ...worldRef.current })
      }
    }, TICK_RATE)
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
      incrementItem(world, itemType, 1)
      setWorld({ ...world })
    },
    buildEntity(entityType) {
      const recipe = world.entityRecipes[entityType]
      invariant(recipe)
      decrementRecipe(world, recipe)
      let entity: Entity
      switch (entityType) {
        case EntityType.enum.StoneFurnace: {
          entity = {
            type: EntityType.enum.StoneFurnace,
            id: `${world.nextEntityId++}`,
            recipeItemType: null,
            craftTicksRemaining: 0,
            fuelTicksRemaining: 0,
            enabled: false,
          }
          break
        }
        case EntityType.enum.BurnerMiningDrill: {
          entity = {
            type: EntityType.enum.BurnerMiningDrill,
            id: `${world.nextEntityId++}`,
            enabled: false,
            fuelTicksRemaining: 0,
            mineTicksRemaining: 0,
            resourceType: null,
          }
          break
        }
        default: {
          invariant(false)
        }
      }

      invariant(!world.entities[entity.id])
      world.entities[entity.id] = entity

      setWorld({ ...world })
    },
    setStoneFurnaceRecipe(id, recipeItemType) {
      if (recipeItemType) {
        invariant(world.furnaceRecipes[recipeItemType])
      }
      const entity = world.entities[id]
      invariant(
        entity?.type === EntityType.enum.StoneFurnace,
      )
      entity.recipeItemType = recipeItemType

      // cancel current recipe
      entity.craftTicksRemaining = 0

      setWorld({ ...world })
    },
    setStoneFurnaceEnabled(id, enabled) {
      const entity = world.entities[id]
      invariant(
        entity?.type === EntityType.enum.StoneFurnace,
      )
      entity.enabled = enabled

      setWorld({ ...world })
    },
    setBurnerMiningDrillResourceType(id, resourceType) {
      const entity = world.entities[id]
      invariant(
        entity?.type === EntityType.enum.BurnerMiningDrill,
      )

      entity.resourceType = resourceType

      // cancel current resource
      entity.mineTicksRemaining = 0

      setWorld({ ...world })
    },
    setBurnerMiningDrillEnabled(id, enabled) {
      const entity = world.entities[id]
      invariant(
        entity?.type === EntityType.enum.BurnerMiningDrill,
      )
      entity.enabled = enabled
      setWorld({ ...world })
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
