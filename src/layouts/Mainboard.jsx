import React from 'react'
import { useLocation, useNavigate, Outlet } from 'react-router-dom';

// Importamos los contextos
import { useApp } from '../contexts/AppProvider'
import { useAuth } from '../contexts/AuthProvider'

// Importamos las constantes
import { THEMES } from '../constants/temas'

// Importamos los componentes
import TitleBar from '../components/TitleBar'
import Notification from '../components/Notification'
import NavActions from '../components/NavActions';

const Mainboard = () => {
    const { tema, notificacion } = useApp();
    const isDark = tema === THEMES.DARK // Verificamos si el tema es oscuro

    return (
        <div className={`flex flex-col h-screen transition-all duration-300 min-w-[525px]
            ${isDark ? 'bg-gray-900 text-white' : 'bg-slate-200 text-gray-900'}`}
        >
            {/* 🟢 Barra de título personalizada */}
            <div className={`w-full col-span-full h-10 bg-opacity-90
                ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900 shadow-md'} transition-all duration-300
            `}>
                <TitleBar />
            </div>
            {/* Contenido principal */}
            {notificacion && <Notification {...notificacion} />}
            <Outlet />
            <NavActions />  
        </div>
    )
}

export default Mainboard
