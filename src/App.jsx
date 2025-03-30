import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

// Importamos el contexto
import { AppProvider } from './contexts/AppProvider'
import { AuthProvider } from './contexts/AuthProvider'
import { QRProvider } from './contexts/QRProvider'
import { FilesProvider } from './contexts/FilesProvider'

// Importamos las páginas
import UploadPage from './pages/UploadPage'
import QRPage from './pages/QRPage'
import FilesPage from './pages/FilesPage'
import NotFound from './pages/NotFound'
import ProfilePage from './pages/ProfilePage'
import Dashboard from './layouts/Dashboard'

// Rutas para la autenticación
import Auth from './layouts/Auth'
import LoginPage from './pages/LoginPage'

function App() {

  return (
    <HashRouter>
      <AppProvider>
        <AuthProvider>
          <QRProvider>
            <FilesProvider>
              <Routes>
                <Route path="/" element={<Auth />}>
                  <Route path="login" element={<LoginPage />} />
                  <Route path="*" element={<NotFound />} />
                </Route>

                <Route path="/dashboard/*" element={
                  <Routes>
                    <Route element={<Dashboard />}>
                      <Route index element={<UploadPage />} />
                      <Route path="qr" element={<QRPage />} />
                      <Route path="files" element={<FilesPage />} />
                      <Route path="profile" element={<ProfilePage />} />
                      <Route path="*" element={<NotFound />} />
                    </Route>
                  </Routes>
                } />
              </Routes>
            </FilesProvider>
          </QRProvider>
        </AuthProvider>
      </AppProvider>
    </HashRouter>
  )
}

export default App
