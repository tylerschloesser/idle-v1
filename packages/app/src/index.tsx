import { config as faConfig } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import invariant from 'tiny-invariant'
import { App } from './app.component.js'
import './index.scss'
import { store } from './store.js'

faConfig.autoAddCss = false

const container = document.getElementById('root')
invariant(container)

createRoot(container).render(
  <Provider store={store}>
    <App />
  </Provider>,
)
