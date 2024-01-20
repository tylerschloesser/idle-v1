import styles from './root-page.module.scss'

export function RootPage() {
  return (
    <>
      <div className={styles.main}>
        <h1 className={styles.header}>idle-v1</h1>
        <div className={styles['bottom-container']}>
          <div className={styles['scroll-down']}>
            <span>Scroll down to learn more</span>
            <span>or</span>
          </div>
          <button className={styles['new-world-button']}>
            Start a new world
          </button>
        </div>
      </div>
      <div className={styles.about}>
        <h2>About</h2>
      </div>
    </>
  )
}
