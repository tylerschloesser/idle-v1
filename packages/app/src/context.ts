import { createContext } from 'react'
import { BlockId, GroupId } from './world.js'

export interface IGroupContext {
  blockId: BlockId
  groupId: GroupId
}

export const GroupContext = createContext<IGroupContext>(
  null!,
)
