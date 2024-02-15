import {
  faHouse,
  faRectangleHistory,
} from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { NavLink } from 'react-router-dom'
import { useWorld } from './store.js'
import styles from './tab-bar.module.scss'
import { World } from './world.js'

const tabs = [
  {
    label: 'Home',
    path: (world: World) => `/world/${world.id}`,
    icon: <FontAwesomeIcon icon={faHouse} />,
  },
  {
    label: 'Log',
    path: (world: World) => `/world/${world.id}/log`,
    icon: <FontAwesomeIcon icon={faRectangleHistory} />,
  },
]

export function TabBar() {
  const world = useWorld()
  return (
    <div className={styles['tab-bar']}>
      {tabs.map(({ label, path, icon }) => (
        <NavLink
          key={label}
          to={path(world)}
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
