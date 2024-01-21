import { useContext } from 'react'
import { Context } from './context.js'
import styles from './world-home.module.scss'
import { WorldMap } from './world-map.component.js'
import { Entity } from './world.js'

function EntityDetails({ entity }: { entity: Entity }) {
  return <div>{entity.type}</div>
}

export function WorldHome() {
  const { world } = useContext(Context)

  const entities = Object.values(world.entities).flat()

  return (
    <>
      <WorldMap />
      <p className={styles.p}>ID: {world.id}</p>
      {entities.map((entity, i) => (
        <EntityDetails key={i} entity={entity} />
      ))}
    </>
  )
}
