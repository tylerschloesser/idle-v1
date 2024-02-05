import { useContext, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import invariant from 'tiny-invariant'
import { Context } from './context.js'
import './world.js'
import { BlockId } from './world.js'

function useBlockId(): BlockId | null {
  const { world } = useContext(Context)
  const [search, setSearch] = useSearchParams()
  const blockId = search.get('blockId')

  useEffect(() => {
    if (blockId === null || !world.blocks[blockId]) {
      const defaultBlockId = Object.keys(world.blocks).at(0)
      invariant(defaultBlockId)
      setSearch((next) => {
        next.set('blockId', defaultBlockId)
        return next
      })
    }
  }, [blockId])

  return blockId ? BlockId.parse(blockId) : null
}

export function WorldHome() {
  const blockId = useBlockId()

  if (!blockId) {
    return null
  }
  return <>{blockId}</>
}
