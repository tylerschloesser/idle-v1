import { useContext, useEffect } from 'react'
import {
  Outlet,
  useNavigate,
  useParams,
} from 'react-router-dom'
import invariant from 'tiny-invariant'
import { Context } from '../context.js'
import { BlockId } from '../world.js'

function useBlockId(): BlockId | null {
  const { blockId } = useParams<{ blockId: string }>()
  const navigate = useNavigate()
  const { world } = useContext(Context)

  useEffect(() => {
    if (!blockId) {
      const defaultBlockId = Object.keys(world.blocks).at(0)
      invariant(defaultBlockId)
      navigate(
        `/world/${world.id}/block/${defaultBlockId}`,
        { replace: true },
      )
    } else if (!world.blocks[blockId]) {
      navigate(`/world/${world.id}/block`, {
        replace: true,
      })
    }
  }, [blockId, world])

  if (!blockId) {
    return null
  }

  return BlockId.parse(blockId)
}

export function BlockPage() {
  const blockId = useBlockId()
  if (!blockId) {
    return null
  }
  return <Outlet />
}
