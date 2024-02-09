import { Outlet } from 'react-router-dom'
import { TabBar } from '../tab-bar.component.js'
import styles from './world-view.module.scss'

export function WorldView() {
  return (
    <>
      <div className={styles['world-view']}>
        <Outlet />
      </div>
      <TabBar />
    </>
  )
}
