import { createContext, useContext } from 'react'
import { Block } from './world.js'

export interface IBlockContext {
  block: Block
}

export const BlockContext = createContext<IBlockContext>(
  null!,
)

export function useBlock() {
  const { block } = useContext(BlockContext)
  return block
}
