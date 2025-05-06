import React, { useEffect } from 'react'
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { FaMoon } from "react-icons/fa";
import { MdOutlineWbSunny } from "react-icons/md";
import { PiNotepadFill } from "react-icons/pi";
import { IoLogOut } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";

// Importamos las constantes
import { THEMES } from '@constants/temas';

// Importamos el contexto
import { useAuth } from '@contexts/AuthProvider';
import { useApp } from '@contexts/AppProvider'

const OptionsCard = () => {
    const { user, logout } = useAuth();
    const {
        tema,
        handleTheme,
        showOptions,
        handleOptions,
        showLogsModal,
        setShowLogsModal
    } = useApp();
    const isDark = tema === THEMES.DARK; // Verificamos si el tema es oscuro

    const handleLogs = () => {
        setShowLogsModal(!showLogsModal);
    };

    const handleLogout = async () => {
        await logout();
    }


    // Ocultar automaticamente despues de 8 segundos si no se hace click
    useEffect(() => {
        if (showOptions) {
            const timer = setTimeout(() => {
                handleOptions();
            }, 8000);
            return () => clearTimeout(timer);
        }
    }, [showOptions, handleOptions]);

    return (
        <AnimatePresence>
            {showOptions && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className={`absolute top-12 right-6 z-50 p-2 rounded-lg shadow-lg flex items-center justify-between gap-2
                        ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
                    `}
                >
                    <button
                        className={`p-2 rounded-lg transition-all duration-300
                            ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-300 text-gray-900 hover:bg-gray-400'} 
                            hover:scale-95 shadow-lg hover:shadow-xl`}
                        title="Cambiar tema"
                        data-tooltip-id="temaLabel"
                        data-tooltip-content="Cambiar entre tema claro y oscuro"
                        onClick={handleTheme}
                    >
                        {tema === 'claro' ? <MdOutlineWbSunny className="text-2xl"/> : <FaMoon className="text-2xl"/>}
                    </button>
                    <ReactTooltip id="temaLabel" place="top" effect="solid"
                        className={`p-2 rounded-lg shadow-lg
                            ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
                        `}
                    />
                    {/* <button
                        className={`p-2 rounded-lg transition-all duration-300
                            ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-300 text-gray-900 hover:bg-gray-400'} 
                            hover:scale-95 shadow-lg hover:shadow-xl`}
                        title="Ver logs"
                        data-tooltip-id="logsLabel"
                        data-tooltip-content="Ver los logs de la aplicación"
                        onClick={handleLogs}
                    >
                        <PiNotepadFill className="text-2xl"/>
                    </button>
                    <ReactTooltip id="logsLabel" place="top" effect="solid"
                        className={`p-2 rounded-lg shadow-lg
                            ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
                        `}
                    /> */}
                    {
                        user && (
                            <>
                                <button
                                    className={`p-2 rounded-lg transition-all duration-300 hover:bg-red-400
                                        ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-300 text-gray-900'} 
                                        hover:scale-95 shadow-lg hover:shadow-xl`}
                                    title="Cerrar sesión"
                                    data-tooltip-id="logoutLabel"
                                    data-tooltip-content="Cerrar la sesión actual"
                                    onClick={handleLogout}
                                >
                                    <IoLogOut className="text-2xl"/>
                                </button>
                                <ReactTooltip id="logoutLabel" place="top" effect="solid"
                                    className={`p-2 rounded-lg shadow-lg
                                        ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
                                    `}  
                                />
                            </>
                        )
                    }
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default OptionsCard
