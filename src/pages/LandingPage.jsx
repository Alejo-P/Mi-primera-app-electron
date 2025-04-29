import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { IoLogIn } from "react-icons/io5";
import { BiSolidDashboard } from "react-icons/bi";

// Importamos los contextos
import { useApp } from '../contexts/AppProvider'
import { useAuth } from '../contexts/AuthProvider'

// Importamos las constantes
import { THEMES } from '../constants/temas'

// Importamos los componentes
import LoginModal from '../modals/LoginModal';

const LandingPage = () => {
    const { tema, setNavActionsItems } = useApp();
    const { user } = useAuth(); // Obtenemos el usuario del contexto de autenticación
    const { pathname } = useLocation(); // Obtenemos la ruta actual
    const navigate = useNavigate(); // Obtenemos la función de navegación
    const [showLoginModal, setShowLoginModal] = useState(false); // Estado para mostrar el modal de inicio de sesión
    const isDark = tema === THEMES.DARK // Verificamos si el tema es oscuro

    const handleLogin = () => {
        if (user) {
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

    useEffect(()=>{
        setNavActionsItems([]); // Limpiamos las acciones del navbar al cargar la página
    }, [])

    return (
        <div className={`flex flex-col m-4 border rounded-lg flex-1 shadow-lg overflow-y-auto
            ${isDark ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} transition-all duration-300`}
        >
            <h1 className="text-4xl font-bold text-center mt-10">
                Bienvenido a <span className="text-blue-500">DocTools</span>
            </h1>
            <p className="text-lg text-center mt-4">
                Una herramienta para facilitar la gestión de documentos y archivos.
            </p>
            {
                user && (
                    <p className="text-lg text-center mt-4">
                        ¡Hola!, de nuevo <span className="font-bold text-orange-700">{user.name}</span>,
                        <br /> ¿Listo para continuar?
                    </p>
                )
            }
            <div className="mt-10 text-center">
                <button
                    onClick={handleLogin}
                    className={`ml-4 px-4 py-2 rounded font-bold transition-all duration-300
                        ${user ? 
                            isDark ? 'bg-green-700 text-white hover:bg-green-600' :
                            'bg-green-300 text-gray-900 hover:bg-green-400'
                            :
                            isDark ? 'bg-blue-700 text-white hover:bg-blue-600' :
                            'bg-blue-300 text-gray-900 hover:bg-blue-400'
                        }
                    `}
                >
                    {user ? (
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
                <p className="text-sm text-gray-500">© 2023 Tu Nombre. Todos los derechos reservados.</p>
                <p className="text-sm text-gray-500">Desarrollado con ❤️ por Tu Nombre</p>
                <p className="text-sm text-gray-500">Versión 1.0.0</p>
                <p className="text-sm text-gray-500">Fecha de lanzamiento: 01/01/2023</p>
            </div>
            {showLoginModal && <LoginModal handleModal={handleModal} />}
            {/* Aquí puedes agregar más contenido o componentes según sea necesario */}
        </div>
    )
}

export default LandingPage
