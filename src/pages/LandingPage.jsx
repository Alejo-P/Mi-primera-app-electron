import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom';
import { IoLogIn } from "react-icons/io5";
import { BiSolidDashboard } from "react-icons/bi";

// Importamos los contextos
import { useApp } from '@contexts/AppProvider'
import { useAuth } from '@contexts/AuthProvider'

// Importamos las constantes
import { THEMES } from '@constants/temas'

// Importamos los componentes
import LoginModal from '@modals/LoginModal';
import VerifyEmailModal from '@modals/VerifyEmailModal';

const LandingPage = () => {
    const { tema, setNavActionsItems } = useApp();
    const { user, isAuthenticated } = useAuth(); // Obtenemos el usuario del contexto de autenticación
    const [searchParams] = useSearchParams();
    
    const navigate = useNavigate(); // Obtenemos la función de navegación
    const [showLoginModal, setShowLoginModal] = useState(false); // Estado para mostrar el modal de inicio de sesión
    const isDark = tema === THEMES.DARK // Verificamos si el tema es oscuro

    // Obtener los parámetros de búsqueda de la URL
    const verifyEmail = searchParams.get('verify-email');
    const token = searchParams.get('token');
    const openLoginModal = searchParams.get('login') || false; // Obtener el parámetro de búsqueda "login"

    // Si los parámetros de búsqueda están presentes, mostramos el modal
    const showModal = verifyEmail && token && !showLoginModal; // Verificamos si el modal de verificación de correo electrónico debe mostrarse
    const showLogin = openLoginModal && !showLoginModal; // Verificamos si el modal de inicio de sesión debe mostrarse
    const handleLogin = () => {
        if (user && isAuthenticated) {
            // Si el usuario ya está autenticado, redirigir a la página de inicio
            navigate('/dashboard/');
        } else {
            // Si el usuario no está autenticado, mostrar el modal de inicio de sesión
            setShowLoginModal(true); // Cambia el estado del modal de inicio de sesión
        }
    }

    const handleModal = () => {
        setShowLoginModal(!showLoginModal); // Cambia el estado del modal de inicio de sesión
    }

    const handleVerifyModal = () => {
        // Ocultar el modal y redirigir a la página de inicio
        navigate('/');
    }

    useEffect(() => {
        if (showLogin) {
            setShowLoginModal(true); // Cambia el estado del modal de inicio de sesión
            navigate('/'); // Redirige a la página de inicio
        }
    }, [showLogin]);
    

    useEffect(()=>{
        if (!showLoginModal) {
            setNavActionsItems([]); // Limpiamos las acciones del navbar al cargar la página
        }
    }, [showLoginModal]);

    return (
        <div className={`flex flex-col m-4 border rounded-lg flex-1 shadow-lg overflow-y-auto scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar
            ${isDark ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} transition-all duration-300`}
        >
            <h1 className="text-4xl font-bold text-center mt-10">
                Bienvenido a <span className="text-blue-500">DocTools</span>
            </h1>
            <p className="text-lg text-center mt-4">
                Una herramienta para facilitar la gestión de documentos y archivos.
            </p>
            {
                (user && isAuthenticated) && (
                    <p className="text-lg text-center mt-4">
                        ¡Hola!, de nuevo <span className="font-bold text-orange-700">{user.name}</span>,
                        <br /> ¿Listo para continuar?
                    </p>
                )
            }
            <div className="mt-10 text-center">
                <button
                    id='btn-login'
                    onClick={handleLogin}
                    className={`ml-4 px-4 py-2 rounded font-bold transition-all duration-300
                        ${(user && isAuthenticated) ? 
                            isDark ? 'bg-green-700 text-white hover:bg-green-600' :
                            'bg-green-300 text-gray-900 hover:bg-green-400'
                            :
                            isDark ? 'bg-blue-700 text-white hover:bg-blue-600' :
                            'bg-blue-300 text-gray-900 hover:bg-blue-400'
                        }
                    `}
                >
                    {(user && isAuthenticated) ? (
                        <span className="flex items-center space-x-2">
                            <BiSolidDashboard className="text-2xl" />
                            <span>Ir al panel de control</span>
                        </span>
                    ) : (
                        <span className="flex items-center space-x-2">
                            <IoLogIn className="text-2xl" />
                            <span>Iniciar sesión</span>
                        </span>
                    )}
                </button>
            </div>
            <div className="mt-10 text-center">
                <p className="text-sm text-gray-500">© 2025 DocTools. Todos los derechos reservados.</p>
                <p className="text-sm text-gray-500">Desarrollado con ❤️ por Alejo-P</p>
                <p className="text-sm text-gray-500">Versión 1.0.0</p>
                <p className="text-sm text-gray-500">Fecha de lanzamiento: ../../2025</p>
            </div>
            {showLoginModal && <LoginModal handleModal={handleModal} />}
            {/* Modal de verificación de correo electrónico */}
            {showModal && (
                <VerifyEmailModal
                    token={token}
                    handleModal={handleVerifyModal}
                    isDark={isDark}
                />
            )}
        </div>
    )
}

export default LandingPage
