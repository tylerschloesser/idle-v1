function MineButton() {
  return (
    <button
      onPointerUp={() => {
        console.log('up')
      }}
    >
      <span>Mine</span>
    </button>
  )
}

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

export function Mine() {
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
