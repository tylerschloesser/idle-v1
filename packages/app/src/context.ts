import { createContext } from 'react'

export interface IContext {
  id: string
}

export const Context = createContext<IContext>(null!)
