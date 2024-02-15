import { useContext } from 'react'
import { GroupContext } from '../context.js'
import { useAvailableEntityTypes } from '../hook.js'

export function NewEntityCardList() {
  const { groupId } = useContext(GroupContext)
  const available = useAvailableEntityTypes(groupId)
  console.log('render')
  return <>{JSON.stringify(available)}</>
}
