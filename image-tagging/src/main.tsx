import { StrictMode } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <DndProvider backend={HTML5Backend}>
    <StrictMode>
      <App />
    </StrictMode>
  </DndProvider>,
)
