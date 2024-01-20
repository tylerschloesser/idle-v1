import styles from './root-page.module.scss'

export function RootPage() {
  return (
    <>
      <div className={styles.main}>
        <h1 className={styles.h1}>idle-v1</h1>
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
        <h2 className={styles.h2}>About</h2>
        <p className={styles.p}>
          I'm baby shoreditch copper mug pork belly yuccie
          kitsch single-origin coffee cupping. Direct trade
          pickled edison bulb fingerstache, street art
          occupy tumeric enamel pin yuccie jean shorts.
        </p>
      </div>
    </>
  )
}
