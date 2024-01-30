import { useContext } from 'react'
import { Button } from './button.component.js'
import { MINE_ACTION_TICKS } from './const.js'
import { Context } from './context.js'
import { Heading3 } from './heading.component.js'
import { ItemLabel } from './item-label.component.js'
import styles from './mine.module.scss'
import { Text } from './text.component.js'
import { ActionType, ResourceType } from './world.js'

function Item({
  resourceType,
}: {
  resourceType: ResourceType
}) {
  const { world, queueAction } = useContext(Context)
  const count = world.inventory[resourceType] ?? 0
  return (
    <>
      <ItemLabel type={resourceType} />
      <span>
        <Text>{count.toFixed()}</Text>
      </span>
      <Button
        onClick={() => {
          queueAction({
            type: ActionType.enum.Mine,
            resourceType,
            ticksRemaining: MINE_ACTION_TICKS,
          })
        }}
      >
        Mine
      </Button>
    </>
  )
}

export function Mine() {
  return (
    <>
      <Heading3>Resources</Heading3>
      <div className={styles.mine}>
        {Object.values(ResourceType.enum).map(
          (resourceType) => (
            <Item
              key={resourceType}
              resourceType={resourceType}
            />
          ),
        )}
      </div>
    </>
  )
}
