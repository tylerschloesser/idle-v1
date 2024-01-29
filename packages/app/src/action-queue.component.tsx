import { Fragment, useContext } from 'react'
import styles from './action-queue.module.scss'
import { Context } from './context.js'

export function ActionQueue() {
  const { world } = useContext(Context)
  return (
    <div className={styles['action-queue']}>
      {world.actionQueue.map((action, i) => (
        <Fragment key={i}>
          <div>
            {action.type} {action.resourceType}
          </div>
        </Fragment>
      ))}
    </div>
  )
}
