import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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

  return (
    <>
      <div>world: {id}</div>
      <WorldMap />
    </>
  )
}
