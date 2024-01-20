import {
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom'
import styles from './app.module.scss'
import { RootPage } from './root-page.component.js'

const router = createBrowserRouter([
  {
    index: true,
    Component: RootPage,
  },
])

export function App() {
  return (
    <div className={styles.app}>
      <RouterProvider router={router} />
    </div>
  )
}
