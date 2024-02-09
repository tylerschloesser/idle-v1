import { Outlet } from 'react-router-dom'
import { TabBar } from '../tab-bar.component.js'

export function WorldView() {
  return (
    <>
      <Outlet />
      <TabBar />
    </>
  )
}
