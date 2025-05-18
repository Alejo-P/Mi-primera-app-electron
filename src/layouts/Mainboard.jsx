import React from 'react'
import { Outlet, useSearchParams, useNavigate } from 'react-router-dom';

// Importamos los contextos
import { useApp } from '@contexts/AppProvider'

// Importamos las constantes
import { THEMES } from '@constants/temas'

// Importamos los componentes
import TitleBar from '@components/TitleBar'
import Notification from '@components/Notification'
import NavActions from '@components/NavActions'
import VerifyEmailModal from '@modals/VerifyEmailmodal';

const Mainboard = () => {
    const { tema, notificacion } = useApp();
    const isDark = tema === THEMES.DARK // Verificamos si el tema es oscuro
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Obtener los parámetros de búsqueda de la URL
    const verifyEmail = searchParams.get('verify-email');
    const token = searchParams.get('token');

    // Si los parámetros de búsqueda están presentes, mostramos el modal
    const showModal = verifyEmail && token;

    const handleModal = () => {
        // Ocultar el modal y redirigir a la página de inicio
        navigate('/');
    }

    return (
        <div className={`flex flex-col h-screen transition-all duration-300 min-w-[525px] scrollbar-track-transparent
            ${isDark ? 'bg-gray-900 text-white scrollbar-thumb-gray-300' : 'bg-slate-200 text-gray-900 scrollbar-thumb-gray-700'}`}
        >
            {/* 🟢 Barra de título personalizada */}
            <div className={`w-full col-span-full h-10 bg-opacity-90 z-60
                ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900 shadow-md'} transition-all duration-300
            `}>
                <TitleBar />
            </div>
            {/* Contenido principal */}
            {notificacion && <Notification {...notificacion} />}
            {/* Modal de verificación de correo electrónico */}
            {showModal && (
                <VerifyEmailModal
                    data={{ token }}
                    handleModal={handleModal}
                    isDark={isDark}
                />
            )}
            {/* Contenido de la aplicación */}
            {!showModal && <Outlet />}
            {/* Acciones de navegación */}
            <NavActions />
        </div>
    )
}

export default Mainboard
