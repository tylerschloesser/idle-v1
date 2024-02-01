import { Fragment, useContext } from 'react'
import { Context } from './context.js'
import { Heading3 } from './heading.component.js'
import { Text } from './text.component.js'
import styles from './world-log.module.scss'

export function WorldLog() {
  const { world } = useContext(Context)
  return (
    <>
      <Heading3>Log</Heading3>
      <div className={styles.log}>
        {world.log.map(({ tick, message }, i) => (
          <Fragment key={i}>
            <Text gray className={styles.tick}>
              {tick}
            </Text>
            <Text className={styles.message}>
              {message}
            </Text>
          </Fragment>
        ))}
      </div>
    </>
  )
}
