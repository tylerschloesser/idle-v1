import { useAvailable } from '../hook.js'

export function NewEntityCardList() {
  const available = useAvailable()
  console.log('render')
  return <>{JSON.stringify(available)}</>
}
