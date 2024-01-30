import { Fragment, useContext } from 'react'
import styles from './action-queue.module.scss'
import { Context } from './context.js'
import { ItemLabel } from './item-label.component.js'
import { Text } from './text.component.js'
import { ActionType } from './world.js'

export function ActionQueue() {
  const { world } = useContext(Context)
  return (
    <div className={styles['action-queue']}>
      {world.actionQueue.map((action, i) => (
        <Fragment key={i}>
          {(() => {
            switch (action.type) {
              case ActionType.enum.Mine:
                return (
                  <div className={styles.action}>
                    <Text>Mine</Text>
                    <ItemLabel type={action.resourceType} />
                  </div>
                )
              case ActionType.enum.Craft:
                return `Craft ${action.itemType}`
            }
          })()}
        </Fragment>
      ))}
    </div>
  )
}
