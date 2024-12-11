import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { EmissionProvider } from './context/EmissionContext.jsx'

createRoot(document.getElementById('root')).render(
  <EmissionProvider>
    <App />
  </EmissionProvider>
)
