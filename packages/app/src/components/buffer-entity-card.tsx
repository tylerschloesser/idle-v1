import { Fragment } from 'react'
import { ItemIcon } from '../icon.component.js'
import { ITEM_TYPE_TO_LABEL } from '../item-label.component.js'
import { formatItemCount } from '../util.js'
import { BufferEntity, ItemType } from '../world.js'
import styles from './buffer-entity-card.module.scss'
import {
  EntityCard,
  EntityCardProps,
} from './entity-card.js'

export function BufferEntityCard({
  entity,
}: EntityCardProps<BufferEntity>) {
  const empty = Object.keys(entity.contents).length === 0
  return (
    <EntityCard entity={entity} empty={empty}>
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
    </EntityCard>
  )
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
