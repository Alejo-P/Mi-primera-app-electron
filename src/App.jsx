import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

// Importamos el contexto
import { AppProvider } from './contexts/AppProvider'
import { QRProvider } from './contexts/QRProvider'

// Importamos las páginas
import UploadPage from './pages/UploadPage'
import QRPage from './pages/QRPage'

function App() {

  return (
    <BrowserRouter>
      <AppProvider>
        <QRProvider>
          <Routes>
            <Route path="/" element={<UploadPage />} />
            <Route path="/qr" element={<QRPage />} />
          </Routes>
        </QRProvider>
      </AppProvider>
    </BrowserRouter>
  )
}

export default App
