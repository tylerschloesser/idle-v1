import { useEffect, useMemo, useState } from 'react'
import { Provider } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import invariant from 'tiny-invariant'
import { WorldView } from '../components/world-view.js'
import { generateWorld } from '../generate-world.js'
import {
  AppDispatch,
  appHidden,
  appVisible,
  createStore,
} from '../store.js'
import { loadWorld } from '../world-api.js'
import { World } from '../world.js'

function useWorld(worldId: string | null): World | null {
  const [world, setWorld] = useState<World | null>(null)
  useEffect(() => {
    if (!worldId) {
      return
    }

    loadWorld(worldId).then((value) => {
      if (value) {
        setWorld(value)
      } else {
        generateWorld(worldId).then(setWorld)
      }
    })
  }, [worldId])
  return world
}

function useVisibility(dispatch: AppDispatch | null) {
  useEffect(() => {
    if (!dispatch) return

    function onVisible() {
      invariant(dispatch)
      dispatch(appVisible())
    }

    function onHidden() {
      invariant(dispatch)
      dispatch(appHidden())
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
  }, [dispatch])
}

function useWorldId(): string | null {
  const worldId = useParams<{ id: string }>().id ?? null
  const navigate = useNavigate()
  useEffect(() => {
    if (worldId === null) {
      navigate('/world/test', { replace: true })
    }
  }, [worldId])
  return worldId
}

export function WorldPage() {
  const worldId = useWorldId()
  const world = useWorld(worldId)

  const store = useMemo(() => {
    if (!world) {
      return null
    }
    return createStore(world)
  }, [world])

  useVisibility(store?.dispatch ?? null)

  if (store === null) {
    return null
  }

  return (
    <Provider store={store}>
      <WorldView />
    </Provider>
  )
}
