import classNames from 'classnames'
import { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { Context } from './context.js'
import styles from './tab-bar.module.scss'

const tabs = [
  {
    label: 'Mine',
    path: 'mine',
  },
  {
    label: 'Build',
    path: 'build',
  },
  {
    label: 'Stats',
    path: 'stats',
  },
  {
    label: 'Settings',
    path: 'settings',
  },
]

export function TabBar() {
  const { world } = useContext(Context)
  return (
    <div className={styles['tab-bar']}>
      <div className={styles.fixed}>
        {tabs.map(({ label, path }) => (
          <NavLink
            key={label}
            to={`/world/${world.id}/${path}`}
            className={({ isActive }) =>
              classNames({
                [styles.item!]: true,
                [styles['item--active']!]: isActive,
              })
            }
          >
            {label}
          </NavLink>
        ))}
      </div>
    </div>
  )
}
