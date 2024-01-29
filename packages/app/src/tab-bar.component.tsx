import classNames from 'classnames'
import { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { Context } from './context.js'
import { Icon, IconName } from './icon.component.js'
import styles from './tab-bar.module.scss'

const tabs = [
  {
    label: 'Home',
    path: 'home',
  },
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
            <Icon name={IconName.House} />
            {label}
          </NavLink>
        ))}
      </div>
    </div>
  )
}
