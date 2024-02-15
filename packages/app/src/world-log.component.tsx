import { Fragment } from 'react'
import { Heading3 } from './heading.component.js'
import { useWorld } from './store.js'
import { Text } from './text.component.js'
import styles from './world-log.module.scss'

export function WorldLog() {
  const world = useWorld()
  return (
    <>
      <Heading3>Log</Heading3>
      <div className={styles.log}>
        {world.log.map(({ tick, message }, i) => (
          <Fragment key={i}>
            <Text gray>{tick}</Text>
            <Text>{message}</Text>
          </Fragment>
        ))}
      </div>
    </>
  )
}
