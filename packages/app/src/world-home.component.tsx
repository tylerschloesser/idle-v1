import { Heading2 } from './heading.component.js'
import { useModel } from './world-home.hooks.js'
import styles from './world-home.module.scss'

export function WorldHome() {
  const model = useModel()

  if (!model) return null

  return (
    <div className={styles['world-home']}>
      <Heading2>Entities</Heading2>
      {model.entities.map((entity) => (
        <div key={entity.id}>{entity.type}</div>
      ))}
    </div>
  )
}
