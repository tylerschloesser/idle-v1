import {
  faHouse,
  faRectangleHistory,
} from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { NavLink } from 'react-router-dom'
import { useWorldId } from './store.js'
import styles from './tab-bar.module.scss'

const tabs = [
  {
    label: 'Home',
    path: (worldId: string) => `/world/${worldId}`,
    icon: <FontAwesomeIcon icon={faHouse} />,
  },
  {
    label: 'Log',
    path: (worldId: string) => `/world/${worldId}/log`,
    icon: <FontAwesomeIcon icon={faRectangleHistory} />,
  },
]

export function TabBar() {
  const worldId = useWorldId()
  return (
    <div className={styles['tab-bar']}>
      {tabs.map(({ label, path, icon }) => (
        <NavLink
          key={label}
          to={path(worldId)}
          className={({ isActive }) =>
            classNames({
              [styles.item!]: true,
              [styles['item--active']!]: isActive,
            })
          }
        >
          {icon}
          <span>{label}</span>
        </NavLink>
      ))}
    </div>
  )
}
