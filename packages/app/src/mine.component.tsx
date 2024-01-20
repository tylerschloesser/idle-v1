import styles from './mine.module.scss'

function MineButton() {
  return (
    <button>
      <span>Mine</span>
      <input
        className={styles.checkbox}
        type="checkbox"
      ></input>
    </button>
  )
}

export function Mine() {
  const resources = [
    {
      label: 'Coal',
      color: 'black',
    },
    {
      label: 'Stone',
      color: 'sand',
    },
  ]

  return (
    <>
      {resources.map(({ label, color }, i) => (
        <div key={i}>
          <div>{label}</div>
          <MineButton />
        </div>
      ))}
    </>
  )
}
