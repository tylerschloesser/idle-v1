import styles from './tab-bar.module.scss'

const tabs = [
  {
    label: 'Mine',
  },
  {
    label: 'Build',
  },
  {
    label: 'Stats',
  },
  {
    label: 'Settings',
  },
]

export function TabBar() {
  return (
    <div className={styles['tab-bar']}>
      <div className={styles.list}>
        {tabs.map(({ label }) => (
          <div key={label} className={styles.item}>
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}
