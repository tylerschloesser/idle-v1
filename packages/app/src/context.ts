import { createContext } from 'react'
import { BlockId } from './world.js'

export interface IBlockContext {
  blockId: BlockId
}

export const BlockContext = createContext<IBlockContext>(
  null!,
)
