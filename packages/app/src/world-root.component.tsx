import { Mine } from './mine.component.js'
import { WorldMap } from './world-map.component.js'

export function WorldRoot() {
  return (
    <>
      <WorldMap />
      <Mine />
    </>
  )
}
