import { Fragment, useContext } from 'react'
import { Button } from './button.component.js'
import { Context } from './context.js'
import { Heading3 } from './heading.component.js'
import styles from './mine.module.scss'
import { ResourceType } from './world.js'

export function Mine() {
  const { world, addItemToInventory } = useContext(Context)
  return (
    <>
      <Heading3>Resources</Heading3>
      <div className={styles.mine}>
        {Object.values(ResourceType.enum).map(
          (resourceType) => (
            <Fragment key={resourceType}>
              <div className={styles.label}>
                {resourceType}
              </div>
              <div className={styles.count}>
                {world.inventory[resourceType] ?? 0}
              </div>
              <Button
                onClick={() => {
                  addItemToInventory(resourceType)
                }}
              >
                Mine
              </Button>
            </Fragment>
          ),
        )}
      </div>
    </>
  )
}
