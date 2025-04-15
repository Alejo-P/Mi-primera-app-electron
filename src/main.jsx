import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// Redirigir a HashRouter si falta el #
if (!window.location.hash) {
  const path = window.location.pathname + window.location.search + window.location.hash;
  const newUrl = '/#' + path;
  window.location.replace(newUrl);
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
