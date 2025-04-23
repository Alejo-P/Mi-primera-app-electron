import { HashRouter, Routes, Route } from 'react-router-dom'
import './App.css'

// Importamos el contexto
import { AppProvider } from './contexts/AppProvider'
import { AuthProvider } from './contexts/AuthProvider'
import { QRProvider } from './contexts/QRProvider'
import { FilesProvider } from './contexts/FilesProvider'

// Importamos las páginas
import LoginPage from './pages/LoginPage'
import UploadPage from './pages/UploadPage'
import QRPage from './pages/QRPage'
import FilesPage from './pages/FilesPage'
import NotFound from './pages/NotFound'
import ProfilePage from './pages/ProfilePage'
import LandingPage from './pages/LandingPage'
import Dashboard from './layouts/Dashboard'

// Rutas para la autenticación
import Auth from './layouts/Auth'
import PrivateRoute from './routes/PrivateRoute';

function App() {
  return (
    <HashRouter>
      <AppProvider>
        <AuthProvider>
          <QRProvider>
            <FilesProvider>
              <Routes>
                {/* Rutas públicas */}
                <Route path="/" element={<Auth />}>
                  <Route index element={<LandingPage />} />
                  <Route path="login" element={<LoginPage />} />
                  <Route path="*" element={<NotFound />} />
                </Route>

                {/* Rutas protegidas */}
                <Route path="/dashboard" element={<PrivateRoute />}>
                  <Route element={<Dashboard />}>
                    <Route index element={<UploadPage />} />
                    <Route path="qr" element={<QRPage />} />
                    <Route path="files" element={<FilesPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Route>
              </Routes>
            </FilesProvider>
          </QRProvider>
        </AuthProvider>
      </AppProvider>
    </HashRouter>
  )
}

export default App
