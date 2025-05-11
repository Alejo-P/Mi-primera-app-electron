import { HashRouter, Routes, Route } from 'react-router-dom'
import { ConfigProvider } from 'react-avatar';
import './App.css'
import './CustomStyles.css'

// Importamos el contexto
import { AppProvider } from '@contexts/AppProvider'
import { AuthProvider } from '@contexts/AuthProvider'
import { AdminProvider } from '@contexts/AdminProvider'
import { QRProvider } from '@contexts/QRProvider'
import { FilesProvider } from '@contexts/FilesProvider'

// Importamos las páginas
import Mainboard from '@layouts/Mainboard'
import Dashboard from '@layouts/Dashboard'
import UploadPage from '@pages/UploadPage'
import QRPage from '@pages/QRPage'
import FilesPage from '@pages/FilesPage'
import NotFound from '@pages/NotFound'
import ProfilePage from '@pages/ProfilePage'
import LandingPage from '@pages/LandingPage'
import AdminUsersPage from '@pages/AdminUsersPage';

// Rutas para la autenticación
import Auth from '@layouts/Auth'
import PrivateRoute from '@routes/PrivateRoute';
import PrivateAdminRoutes from '@routes/PrivateAdminRoutes';

function App() {
  return (
    <HashRouter>
      <AppProvider>
        <AuthProvider>
          <ConfigProvider>
            <AdminProvider>
              <QRProvider>
                <FilesProvider>
                  <Routes>
                    {/* Rutas públicas */}
                    <Route path="/" element={<Auth />} >
                      <Route element={<Mainboard />} >
                        <Route index element={<LandingPage />} />
                        <Route path="*" element={<NotFound />} />
                      </Route>
                      <Route path="*" element={<NotFound />} />
                    </Route>

                    {/* Rutas protegidas */}
                    <Route path="/dashboard" element={<PrivateRoute />}>
                      <Route element={<Dashboard />}>
                        <Route index element={<UploadPage />} />
                        <Route path="qr" element={<QRPage />} />
                        <Route path="files" element={<FilesPage />} />
                        <Route path="profile/:userID" element={<ProfilePage />} />

                        {/* Rutas para los administradores */}
                        <Route path='admin' element={<PrivateAdminRoutes />}>
                          <Route path="users" element={<AdminUsersPage />} />
                          <Route path="*" element={<NotFound />} />
                        </Route>
                        
                        <Route path="*" element={<NotFound />} />
                      </Route>
                    </Route>
                  </Routes>
                </FilesProvider>
              </QRProvider>
            </AdminProvider>
          </ConfigProvider>
        </AuthProvider>
      </AppProvider>
    </HashRouter>
  )
}

export default App
