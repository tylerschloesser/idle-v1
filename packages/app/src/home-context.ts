import { createContext } from 'react'
import { Block } from './world.js'

export interface IHomeContext {
  block: Block
}
export const HomeContext = createContext<IHomeContext>(
  null!,
)
