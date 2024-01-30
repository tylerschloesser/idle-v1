import { useContext } from 'react'
import { Button } from './button.component.js'
import { Context } from './context.js'
import { Heading3 } from './heading.component.js'
import { ItemLabel } from './item-label.component.js'
import styles from './mine.module.scss'
import { Text } from './text.component.js'
import { ResourceType } from './world.js'

function Item({
  resourceType,
}: {
  resourceType: ResourceType
}) {
  const { world, mineResource } = useContext(Context)
  const count = world.inventory[resourceType] ?? 0
  return (
    <>
      <ItemLabel type={resourceType} />
      <span>
        <Text>{count.toFixed()}</Text>
      </span>
      <Button
        onClick={() => {
          mineResource(resourceType)
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
