import {
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom'
import styles from './app.module.scss'
import { RootPage } from './root-page.component.js'
import { WorldMine } from './world-mine.component.js'
import { WorldPage } from './world-page.component.js'
import { WorldRoot } from './world-root.component.js'

const router = createBrowserRouter([
  {
    index: true,
    Component: RootPage,
  },
  {
    path: 'world/:id?',
    Component: WorldPage,
    children: [
      {
        index: true,
        Component: WorldRoot,
      },
      {
        path: 'mine',
        Component: WorldMine,
      },
    ],
  },
])

export function App() {
  return (
    <div className={styles.app}>
      <RouterProvider router={router} />
    </div>
  )
}
