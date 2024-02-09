import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import invariant from 'tiny-invariant'
import { WorldView } from '../components/world-view.js'
import { TICK_RATE } from '../const.js'
import {
  WorldContext,
  buildWorldContext,
} from '../context.js'
import { generateWorld } from '../generate-world.js'
import { tickWorld } from '../tick-world.js'
import { getIsoDiffMs } from '../util.js'
import {
  fastForward,
  loadWorld,
  saveWorld,
} from '../world-api.js'
import { World } from '../world.js'

function useWorld(): [
  World | null,
  (cb: (world: World) => World) => void,
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

  const setWorldWrapped = (cb: (prev: World) => World) => {
    setWorld((prev) => {
      invariant(prev)
      return cb(prev)
    })
  }

  return [world, setWorldWrapped]
}

export function WorldPage() {
  const [world, setWorld] = useWorld()

  if (world === null) {
    return null
  }

  const context = buildWorldContext(world, setWorld)

  return (
    <WorldContext.Provider value={context}>
      <WorldView />
    </WorldContext.Provider>
  )
}
