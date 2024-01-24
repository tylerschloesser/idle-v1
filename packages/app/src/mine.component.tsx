import { useContext } from 'react'
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
  const limit = world.inventoryLimits[resourceType]
  return (
    <>
      <Text>{resourceType}</Text>
      <span>
        <Text>{world.inventory[resourceType] ?? 0}</Text>
        <Text gray>{` / ${limit}`}</Text>
      </span>
      <Button
        onClick={() => {
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
