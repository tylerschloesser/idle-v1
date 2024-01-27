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
import { buildEntity } from './build-entity.js'
import { ROOT_GROUP_ID, TICK_RATE } from './const.js'
import { Context, IContext } from './context.js'
import {
  decrementRecipe,
  incrementItem,
} from './inventory.js'
import { TabBar } from './tab-bar.component.js'
import { tickWorld } from './tick-world.js'
import { getIsoDiffMs } from './util.js'
import {
  fastForward,
  generateWorld,
  loadWorld,
  saveWorld,
} from './world-api.js'
import { WorldMap } from './world-map.component.js'
import styles from './world-page.module.scss'
import { EntityType, World } from './world.js'

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
    let interval: number | null = null

    function onVisible() {
      if (worldRef.current) {
        fastForward(worldRef.current)
      }

      interval = self.setInterval(() => {
        if (worldRef.current) {
          const elapsed = getIsoDiffMs(
            worldRef.current.lastTick,
          )
          if (elapsed >= TICK_RATE * 2) {
            console.warn(`world is behind by ${elapsed}ms`)
          }

          tickWorld(worldRef.current)
          setWorld({ ...worldRef.current })
        }
      }, TICK_RATE)
    }

    function onHidden() {
      if (interval) {
        self.clearInterval(interval)
        interval = null
      }
    }

    function onVisibilityChange() {
      if (document.visibilityState === 'visible') {
        onVisible()
      } else {
        invariant(document.visibilityState === 'hidden')
        onHidden()
      }
    }

    document.addEventListener(
      'visibilitychange',
      onVisibilityChange,
    )

    onVisible()

    return () => {
      onHidden()
      document.removeEventListener(
        'visibilitychange',
        onVisibilityChange,
      )
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
      const entity = buildEntity(
        world,
        entityType,
        ROOT_GROUP_ID,
      )
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
      entity.craftTicksRemaining = null

      setWorld({ ...world })
    },
    setAssemblerRecipe(id, recipeItemType) {
      if (recipeItemType) {
        invariant(world.assemblerRecipes[recipeItemType])
      }
      const entity = world.entities[id]
      invariant(entity?.type === EntityType.enum.Assembler)
      entity.recipeItemType = recipeItemType

      // cancel current recipe
      entity.craftTicksRemaining = null

      setWorld({ ...world })
    },
    setBurnerMiningDrillResourceType(id, resourceType) {
      const entity = world.entities[id]
      invariant(
        entity?.type === EntityType.enum.BurnerMiningDrill,
      )

      entity.resourceType = resourceType

      // cancel current resource
      entity.mineTicksRemaining = null

      setWorld({ ...world })
    },
    setEntityEnabled(id, enabled) {
      const entity = world.entities[id]
      invariant(entity)
      entity.enabled = enabled
      setWorld({ ...world })
    },
    destroyEntity(entityId) {
      invariant(world.entities[entityId])
      delete world.entities[entityId]
      setWorld({ ...world })
    },
  }

  return (
    <div className={styles['world-page']}>
      <Context.Provider value={context}>
        <WorldMap />
        <Outlet />
        <TabBar />
      </Context.Provider>
    </div>
  )
}
