import { useModel } from './world-home.hooks.js'

export function WorldHome() {
  const model = useModel()

  if (!model) return null

  return (
    <>
      {model.entities.map((entity) => (
        <div key={entity.id}>{entity.type}</div>
      ))}
    </>
  )
}
