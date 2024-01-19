import { createRoot } from 'react-dom/client'
import invariant from 'tiny-invariant'

const container = document.getElementById('app')
invariant(container)

createRoot(container).render(<h1>Hello world</h1>)
