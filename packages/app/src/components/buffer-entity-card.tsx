import { Fragment } from 'react'
import { ItemIcon } from '../icon.component.js'
import { ITEM_TYPE_TO_LABEL } from '../item-label.component.js'
import { Text } from '../text.component.js'
import { formatItemCount } from '../util.js'
import {
  BufferEntity,
  ItemType,
  ResourceType,
} from '../world.js'
import styles from './buffer-entity-card.module.scss'

interface ItemGroup {
  label: string
  items: Partial<Record<ItemType, number>>
}

export function BufferEntityCard({
  entity,
}: {
  entity: BufferEntity
}) {
  const empty = Object.keys(entity.contents).length === 0
  return (
    <>
      {empty ? (
        <Text gray>Empty</Text>
      ) : (
        <div className={styles['contents']}>
          {mapBufferEntityContents(
            entity,
            (itemType, count) => (
              <Fragment key={itemType}>
                <div>
                  <ItemIcon type={itemType} />{' '}
                  {ITEM_TYPE_TO_LABEL[itemType]}
                </div>
                <div>{formatItemCount(count)}</div>
              </Fragment>
            ),
          )}
        </div>
      )}
    </>
  )
}

function* iterateItemTypes(
  values: string[],
): Generator<ItemType> {
  for (const value of values) {
    yield ItemType.parse(value)
  }
}

function mapItemGroups(
  entity: BufferEntity,
  cb: (group: ItemGroup) => JSX.Element,
): JSX.Element[] {
  const groups: ItemGroup[] = []

  {
    const group: ItemGroup = {
      label: 'Resources',
      items: {},
    }
    for (const itemType of iterateItemTypes(
      Object.values(ResourceType.Values),
    )) {
      const value = entity.contents[itemType]
      if (!value) continue
      group.items[itemType] = value.count
    }
    if (Object.keys(group).length > 0) {
      groups.push(group)
    }
  }

  return groups.map((group) => (
    <Fragment key={group.label}>{cb(group)}</Fragment>
  ))
}

function mapBufferEntityContents(
  entity: BufferEntity,
  cb: (itemType: ItemType, count: number) => JSX.Element,
): JSX.Element[] {
  const result: JSX.Element[] = []
  for (const [key, value] of Object.entries(
    entity.contents,
  )) {
    result.push(cb(ItemType.parse(key), value.count))
  }
  return result
}
