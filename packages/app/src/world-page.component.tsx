import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Context, IContext } from './context.js'
import { WorldMap } from './world-map.component.js'

function useWorldId(): string | null {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  useEffect(() => {
    if (id) return
    navigate('/world/test', { replace: true })
  }, [id])
  return id ?? null
}

export function WorldPage() {
  const id = useWorldId()

  if (id === null) {
    return null
  }

  const context: IContext = { id }

  return (
    <>
      <Context.Provider value={context}>
        <div>world: {id}</div>
        <WorldMap />
      </Context.Provider>
    </>
  )
}
