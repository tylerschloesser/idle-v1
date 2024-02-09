import { useEffect } from 'react'
import {
  RouterProvider,
  createBrowserRouter,
  useNavigate,
} from 'react-router-dom'
import styles from './app.module.scss'
import { BlockPage } from './pages/block-page.js'
import { BuildPage } from './pages/build-page.js'
import { GroupPage } from './pages/group-page.js'
import { WorldPage } from './pages/world-page.js'
import { RootPage } from './root-page.component.js'
import { WorldLog } from './world-log.component.js'

function Redirect({ to }: { to: string }) {
  const navigate = useNavigate()
  useEffect(() => {
    navigate(to, { replace: true })
  }, [])
  return null
}

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
        Component: () => <Redirect to="block" />,
      },
      {
        path: 'log',
        Component: WorldLog,
      },
      {
        path: 'block/:blockId?',
        Component: BlockPage,
        children: [
          {
            index: true,
            Component: () => <Redirect to="group" />,
          },
          {
            path: 'group/:groupId?',
            Component: GroupPage,
            children: [
              {
                path: 'build',
                Component: BuildPage,
              },
            ],
          },
        ],
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
