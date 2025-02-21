import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

// Importamos el contexto
import { AppProvider } from './contexts/AppProvider'
import { QRProvider } from './contexts/QRProvider'
import { FilesProvider } from './contexts/FilesProvider'

// Importamos las páginas
import UploadPage from './pages/UploadPage'
import QRPage from './pages/QRPage'
import FilesPage from './pages/FilesPage'
import Dashboard from './layouts/Dashboard'

function App() {

  return (
    <HashRouter>
      <AppProvider>
        <QRProvider>
          <FilesProvider>
            <Routes>
              <Route index element={
                // Redirigimos a la página de inicio
                <Navigate to="/dashboard/" />
              } />
              <Route path="/dashboard/*" element={
                <Routes>
                  <Route element={<Dashboard />}>
                    <Route index element={<UploadPage />} />
                    <Route path="qr" element={<QRPage />} />
                    <Route path="files" element={<FilesPage />} />
                  </Route>
                </Routes>
              } />
            </Routes>
          </FilesProvider>
        </QRProvider>
      </AppProvider>
    </HashRouter>
  )
}

export default App
