import {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Context, IContext } from './context.js'
import { Mine } from './mine.component.js'
import {
  generateWorld,
  loadWorld,
  saveWorld,
} from './world-api.js'
import { WorldMap } from './world-map.component.js'
import { World } from './world.js'

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
  const [world] = useWorld()

  if (world === null) {
    return null
  }

  const context: IContext = {
    world,
    addItemToInventory(itemType) {
      world.inventory[itemType] =
        (world.inventory[itemType] ?? 0) + 1
    },
  }

  return (
    <>
      <Context.Provider value={context}>
        <div>world: {world.id}</div>
        <WorldMap />
        <Mine />
      </Context.Provider>
    </>
  )
}
