import { config as faConfig } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { createRoot } from 'react-dom/client'
import invariant from 'tiny-invariant'
import { App } from './app.component.js'
import './index.scss'

faConfig.autoAddCss = false

const container = document.getElementById('root')
invariant(container)

createRoot(container).render(<App />)
