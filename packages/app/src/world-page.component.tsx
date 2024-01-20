import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Context, IContext } from './context.js'
import { generateWorld, loadWorld } from './world-api.js'
import { WorldMap } from './world-map.component.js'
import { World } from './world.js'

function useWorld(): World | null {
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

  return world
}

export function WorldPage() {
  const world = useWorld()

  if (world === null) {
    return null
  }

  const context: IContext = { world }

  return (
    <>
      <Context.Provider value={context}>
        <div>world: {world.id}</div>
        <WorldMap />
      </Context.Provider>
    </>
  )
}
