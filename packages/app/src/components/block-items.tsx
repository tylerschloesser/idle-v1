import { motion } from 'framer-motion'
import { Fragment } from 'react'
import { Values } from 'zod'
import { Heading3 } from '../heading.component.js'
import { ItemLabel } from '../item-label.component.js'
import { Text } from '../text.component.js'
import { formatItemCount } from '../util.js'
import {
  Block,
  EntityType,
  EphemeralType,
  IntermediateType,
  ItemType,
  ResourceType,
} from '../world.js'
import styles from './block-items.module.scss'

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

export function BlockItems({ block }: { block: Block }) {
  const empty = Object.keys(block.items).length === 0
  return (
    <motion.div layout className={styles['card']}>
      <motion.div
        layout="position"
        className={styles['card-inner']}
      >
        {empty ? (
          <Text gray>Empty</Text>
        ) : (
          mapItemGroups(block, ({ label, items }) => (
            <Fragment key={label}>
              <Heading3>{label}</Heading3>
              <div className={styles['item-group']}>
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
      </motion.div>
    </motion.div>
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
  block: Block,
  label: string,
  itemTypes: ItemType[],
): ItemGroup | null {
  const group: ItemGroup = {
    label,
    items: {},
  }
  for (const itemType of itemTypes) {
    const item = block.items[itemType]
    if (!item) continue
    group.items[itemType] = item.count
  }

  if (Object.keys(group.items).length === 0) {
    return null
  }
  return group
}

function* iterateItemGroups(block: Block) {
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
      label: 'Ephemerals',
      itemTypes: enumToItemTypes(EphemeralType.Values),
    },
    {
      label: 'Entities',
      itemTypes: enumToItemTypes(EntityType.Values),
    },
  ]) {
    const group = buildGroup(block, label, itemTypes)
    if (group) {
      yield group
    }
  }
}

function mapItemGroups(
  block: Block,
  cb: (group: ItemGroup) => JSX.Element,
): JSX.Element[] {
  const groups: ItemGroup[] = [...iterateItemGroups(block)]
  return groups.map((group) => cb(group))
}
