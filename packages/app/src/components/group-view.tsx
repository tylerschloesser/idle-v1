import { createSelector } from '@reduxjs/toolkit'
import { LayoutGroup } from 'framer-motion'
import { useContext } from 'react'
import { useSelector } from 'react-redux'
import invariant from 'tiny-invariant'
import { GroupContext } from '../context.js'
import { Heading2 } from '../heading.component.js'
import { RootState } from '../store.js'
import { GroupId } from '../world.js'
import { EntityCard } from './entity-card.js'
import styles from './group-view.module.scss'

const selectGroup = createSelector(
  [
    (state: RootState) => state.world.groups,
    (_state: RootState, groupId: GroupId) => groupId,
  ],
  (groups, groupId) => {
    const group = groups[groupId]
    invariant(group)
    return group
  },
)

export function GroupView() {
  const { groupId } = useContext(GroupContext)
  const group = useSelector((state: RootState) =>
    selectGroup(state, groupId),
  )
  const entityIds = Object.keys(group.entityIds)

  return (
    <div className={styles['group-view']}>
      <LayoutGroup>
        <Heading2>Entities</Heading2>
        {entityIds.map((entityId) => (
          <EntityCard key={entityId} entityId={entityId} />
        ))}
        <Heading2>Build</Heading2>
      </LayoutGroup>
    </div>
  )
}
