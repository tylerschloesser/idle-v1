import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate()
  return (
    <div className={styles['tab-bar']}>
      <div className={styles.fixed}>
        {tabs.map(({ label, path }) => (
          <a
            href={`/world/${world.id}/${path}`}
            key={label}
            className={styles.item}
            onClick={(e) => {
              e.preventDefault()
              navigate(`/world/${world.id}/${path}`)
            }}
          >
            {label}
          </a>
        ))}
      </div>
    </div>
  )
}
