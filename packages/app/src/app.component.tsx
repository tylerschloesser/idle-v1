import { useEffect } from 'react'
import {
  RouterProvider,
  createBrowserRouter,
  useNavigate,
} from 'react-router-dom'
import styles from './app.module.scss'
import { RootPage } from './root-page.component.js'
import { WorldHome } from './world-home.component.js'
import { WorldLog } from './world-log.component.js'
import { WorldPage } from './world-page.component.js'

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
        Component: () => <Redirect to="home" />,
      },
      {
        path: 'home',
        Component: WorldHome,
      },
      {
        path: 'log',
        Component: WorldLog,
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
