import React, { useEffect } from 'react'
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { FaMoon } from "react-icons/fa";
import { MdOutlineWbSunny } from "react-icons/md";
import { IoTimer } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";

// Importamos el contexto
import { useApp } from '../contexts/AppProvider'

const OptionsCard = () => {
    const { tema, handleTheme, showOptions, handleOptions } = useApp();
    const isDark = tema === 'oscuro';

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
                    <button
                        className={`p-2 rounded-lg transition-all duration-300
                            ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-300 text-gray-900 hover:bg-gray-400'} 
                            hover:scale-95 shadow-lg hover:shadow-xl`}
                        title="Cambiar duración"
                        data-tooltip-id="duracionLabel"
                        data-tooltip-content="Cambiar la duración de las notificaciones"
                    >
                        <IoTimer className="text-2xl"/>
                    </button>
                    <ReactTooltip id="duracionLabel" place="top" effect="solid"
                        className={`p-2 rounded-lg shadow-lg
                            ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
                        `}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default OptionsCard
