import { useContext } from 'react'
import { Context } from './context.js'
import styles from './world-home.module.scss'
import { WorldMap } from './world-map.component.js'

export function WorldHome() {
  const { world } = useContext(Context)
  return (
    <>
      <WorldMap />
      <p className={styles.p}>ID: {world.id}</p>
    </>
  )
}
