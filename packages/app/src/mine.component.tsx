import { faCircle } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useContext } from 'react'
import invariant from 'tiny-invariant'
import { Button } from './button.component.js'
import { Context } from './context.js'
import { Heading3 } from './heading.component.js'
import styles from './mine.module.scss'
import { Text } from './text.component.js'
import { ResourceType } from './world.js'

function Item({
  resourceType,
}: {
  resourceType: ResourceType
}) {
  const { world, addItemToInventory } = useContext(Context)
  const count = world.inventory[resourceType] ?? 0
  const limit = world.inventoryLimits[resourceType]
  invariant(count <= limit)
  const disabled = count >= limit
  return (
    <>
      <span className={styles.resource}>
        <FontAwesomeIcon icon={faCircle} />
        <Text>{resourceType}</Text>
      </span>
      <span>
        <Text>{count}</Text>
        <Text gray>{` / ${limit}`}</Text>
      </span>
      <Button
        disabled={disabled}
        onClick={() => {
          if (disabled) return
          addItemToInventory(resourceType)
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
