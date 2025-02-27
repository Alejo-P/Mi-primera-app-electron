import React, { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { HiHome } from "react-icons/hi";
import { FaQrcode } from "react-icons/fa6";
import { FaRegFileAlt } from "react-icons/fa";

// Importamos los contextos
import { useApp } from '../contexts/AppProvider'

// Importamos los componentes
import HeaderNav from '../components/HeaderNav'
import Notification from '../components/Notification'
import NavButton from '../components/NavButton';
import TitleBar from '../components/TitleBar';

const Dashboard = () => {
    const { notificacion, tema, setCurrentPath } = useApp();
    const { pathname } = useLocation();
    const isDark = tema === 'oscuro';

    useEffect(() => {
        setCurrentPath(pathname);
    }, [pathname]); // Se ejecuta cuando cambia la ruta

    return (
        <div className={`grid grid-cols-[20%_80%] grid-rows-[40px_50px_1fr] h-screen transition-all duration-300 min-w-[525px]
            ${isDark ? 'bg-gray-900 text-white' : 'bg-slate-200 text-gray-900'}`}
        >
            {/* 🟢 Barra de título personalizada */}
            <div className={`w-full col-span-full h-10 bg-opacity-90
                ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900 shadow-md'} transition-all duration-300
            `}>
                <TitleBar />
            </div>

            {/* 🔵 Header Nav */}
            <div className="w-full col-span-full h-12 flex items-center justify-evenly">
                <HeaderNav
                    text={
                        pathname === '/dashboard/' ? "Cargar un archivo" : 
                        pathname === '/dashboard/files' ? "Lista de archivos" :
                        pathname === '/dashboard/qr' ? "Lista de códigos QR" : 
                        "Inicio"
                    }
                    isDark={isDark}
                />
            </div>

            {/* 🟡 Sidebar de navegación */}
            <div className={`flex flex-col m-2 w-full justify-evenly gap-2 p-2 rounded-lg border
                ${isDark ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300 shadow-md'} transition-all duration-300`}
            >
                <NavButton 
                    to="/dashboard/" 
                    active={pathname === "/dashboard/"} 
                    icon={<HiHome className="text-3xl" />} 
                    tooltip="Inicio" 
                    isDark={isDark}
                />
                <NavButton 
                    to="/dashboard/qr" 
                    active={pathname === "/dashboard/qr"} 
                    icon={<FaQrcode className="text-3xl" />} 
                    tooltip="QRs generados" 
                    isDark={isDark}
                />
                <NavButton 
                    to="/dashboard/files" 
                    active={pathname === "/dashboard/files"} 
                    icon={<FaRegFileAlt className="text-3xl" />} 
                    tooltip="Archivos cargados" 
                    isDark={isDark}
                />
            </div>

            {/* 🔴 Contenedor de Contenido */}
            <div className={`flex flex-row m-4 border rounded-lg flex-1 shadow-lg overflow-y-auto
                ${isDark ? 'border-gray-600' : 'border-gray-300 shadow-md'} transition-all duration-300`}
            >
                {notificacion && <Notification {...notificacion} />}
                <Outlet />
            </div>
        </div>
    )
}

export default Dashboard;
