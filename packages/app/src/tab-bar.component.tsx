import {
  faHouse,
  faRectangleHistory,
} from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { WorldContext } from './context.js'
import styles from './tab-bar.module.scss'

const tabs = [
  {
    label: 'Home',
    path: 'home',
    icon: <FontAwesomeIcon icon={faHouse} />,
  },
  {
    label: 'Log',
    path: 'log',
    icon: <FontAwesomeIcon icon={faRectangleHistory} />,
  },
]

export function TabBar() {
  const { world } = useContext(WorldContext)
  return (
    <div className={styles['tab-bar']}>
      <div className={styles.fixed}>
        {tabs.map(({ label, path, icon }) => (
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
            {icon}
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  )
}
