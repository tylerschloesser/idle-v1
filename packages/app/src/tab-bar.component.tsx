import {
  faHammer,
  faHouse,
  faPickaxe,
  faRectangleHistory,
} from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { Context } from './context.js'
import styles from './tab-bar.module.scss'

const tabs = [
  {
    label: 'Home',
    path: 'home',
    icon: <FontAwesomeIcon icon={faHouse} />,
  },
  {
    label: 'Mine',
    path: 'mine',
    icon: <FontAwesomeIcon icon={faPickaxe} />,
  },
  {
    label: 'Build',
    path: 'build',
    icon: <FontAwesomeIcon icon={faHammer} />,
  },
  {
    label: 'Log',
    path: 'log',
    icon: <FontAwesomeIcon icon={faRectangleHistory} />,
  },
  // {
  //   label: 'Settings',
  //   path: 'settings',
  //   icon: <FontAwesomeIcon icon={faGear} />,
  // },
]

export function TabBar() {
  const { world } = useContext(Context)
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
