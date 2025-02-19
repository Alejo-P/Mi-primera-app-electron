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

const Dashboard = () => {
    const { notificacion, tema } = useApp();
    const { pathname } = useLocation();
    const isDark = tema === 'oscuro';

    return (
        <div className={`grid grid-cols-[20%_80%] grid-rows-[auto_1fr] h-screen transition-all duration-300 
            ${isDark ? 'bg-gray-900 text-white' : 'bg-slate-200 text-gray-900'}`}
        >
            {/* 🟢 Header */}
            <div className="w-full col-span-full h-auto bg-opacity-90">
                <HeaderNav
                    text={
                        pathname === '/dashboard/' ? "Subir un archivo" : 
                        pathname === '/dashboard/files' ? "Lista de archivos" :
                        pathname === '/dashboard/qr' ? "Lista de códigos QR" : 
                        "Inicio"
                    }
                    isDark={isDark}
                />
            </div>

            {/* 🟡 Sidebar de navegación */}
            <div className={`flex flex-col m-2 w-full justify-evenly gap-3 flex-1 p-3 rounded-lg border
                ${isDark ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300 shadow-md'} transition-all duration-300`}
            >
                <NavButton 
                    to="/dashboard/" 
                    active={pathname === "/dashboard/"} 
                    icon={<HiHome className="text-5xl" />} 
                    tooltip="Ir a inicio" 
                    tooltipId="homeLabel" 
                    isDark={isDark}
                />
                <NavButton 
                    to="/dashboard/qr" 
                    active={pathname === "/dashboard/qr"} 
                    icon={<FaQrcode className="text-5xl" />} 
                    tooltip="Ver QRs generados" 
                    tooltipId="QRLabel" 
                    isDark={isDark}
                />
                <NavButton 
                    to="/dashboard/files" 
                    active={pathname === "/dashboard/files"} 
                    icon={<FaRegFileAlt className="text-5xl" />} 
                    tooltip="Ver archivos cargados" 
                    tooltipId="FilesLabel" 
                    isDark={isDark}
                />

                {/* Tooltips */}
                <ReactTooltip id="homeLabel" place="top" effect="solid" className="z-50" />
                <ReactTooltip id="QRLabel" place="top" effect="solid" className="z-50" />
                <ReactTooltip id="FilesLabel" place="top" effect="solid" className="z-50" />
            </div>

            {/* 🔵 Contenedor de Contenido */}
            <div className={`flex flex-row m-4 border rounded-lg flex-1 shadow-lg overflow-y-auto
                ${isDark ? 'border-gray-600' : 'border-gray-300 shadow-md'} transition-all duration-300`}
            >
                {notificacion && <Notification {...notificacion} />}
                <Outlet />
            </div>
        </div>
    )
}

export default Dashboard
