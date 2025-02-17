import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

// Importamos el contexto
import { AppProvider } from './contexts/AppProvider'
import { QRProvider } from './contexts/QRProvider'
import { FilesProvider } from './contexts/FilesProvider'

// Importamos las páginas
import UploadPage from './pages/UploadPage'
import QRPage from './pages/QRPage'
import FilesPage from './pages/FilesPage'

function App() {

  return (
    <BrowserRouter>
      <AppProvider>
        <QRProvider>
          <FilesProvider>
            <Routes>
              <Route path="/" element={<UploadPage />} />
              <Route path="/qr" element={<QRPage />} />
              <Route path="/files" element={<FilesPage />} />
            </Routes>
          </FilesProvider>
        </QRProvider>
      </AppProvider>
    </BrowserRouter>
  )
}

export default App
