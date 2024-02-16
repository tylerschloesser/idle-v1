import { Fragment } from 'react'
import { Values } from 'zod'
import { Heading3 } from '../heading.component.js'
import { ItemLabel } from '../item-label.component.js'
import { Text } from '../text.component.js'
import { formatItemCount } from '../util.js'
import {
  BufferEntity,
  EntityType,
  IntermediateType,
  ItemType,
  ResourceType,
} from '../world.js'
import styles from './buffer-entity-card.module.scss'

interface ItemGroup {
  label: string
  items: Partial<Record<ItemType, number>>
}

function mapItems(
  items: ItemGroup['items'],
  cb: (itemType: ItemType, count: number) => JSX.Element,
): JSX.Element[] {
  return Object.entries(items).map(([key, value]) =>
    cb(ItemType.parse(key), value),
  )
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
        mapItemGroups(entity, ({ label, items }) => (
          <Fragment key={label}>
            <Heading3>{label}</Heading3>
            <div className={styles['group-items']}>
              {mapItems(items, (itemType, count) => (
                <Fragment key={itemType}>
                  <ItemLabel type={itemType} />
                  <Text>{formatItemCount(count)}</Text>
                </Fragment>
              ))}
            </div>
          </Fragment>
        ))
      )}
    </>
  )
}

function enumToItemTypes(
  values: Values<[string]>,
): ItemType[] {
  return Object.values(values).map((value) =>
    ItemType.parse(value),
  )
}

function buildGroup(
  buffer: BufferEntity,
  label: string,
  itemTypes: ItemType[],
): ItemGroup | null {
  const group: ItemGroup = {
    label,
    items: {},
  }
  for (const itemType of itemTypes) {
    const value = buffer.contents[itemType]
    if (!value) continue
    group.items[itemType] = value.count
  }

  if (Object.keys(group.items).length === 0) {
    return null
  }
  return group
}

function* iterateItemGroups(buffer: BufferEntity) {
  for (const { label, itemTypes } of [
    {
      label: 'Resources',
      itemTypes: enumToItemTypes(ResourceType.Values),
    },
    {
      label: 'Intermediates',
      itemTypes: enumToItemTypes(IntermediateType.Values),
    },
    {
      label: 'Entities',
      itemTypes: enumToItemTypes(EntityType.Values),
    },
  ]) {
    const group = buildGroup(buffer, label, itemTypes)
    if (group) {
      yield group
    }
  }
}

function mapItemGroups(
  entity: BufferEntity,
  cb: (group: ItemGroup) => JSX.Element,
): JSX.Element[] {
  const groups: ItemGroup[] = [...iterateItemGroups(entity)]
  return groups.map((group) => cb(group))
}
