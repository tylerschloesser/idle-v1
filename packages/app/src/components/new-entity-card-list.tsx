import { useContext } from 'react'
import { useSelector } from 'react-redux'
import { GroupContext } from '../context.js'
import { selectBuffers } from '../selectors.js'
import { RootState } from '../store.js'

export function NewEntityCardList() {
  const { groupId } = useContext(GroupContext)
  const buffers = useSelector((state: RootState) =>
    selectBuffers(state, groupId),
  )

  return <>{buffers.length}</>
}
