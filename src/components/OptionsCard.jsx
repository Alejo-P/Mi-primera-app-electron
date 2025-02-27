import React from 'react'
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { FaMoon } from "react-icons/fa";
import { MdOutlineWbSunny } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

// Importamos el contexto
import { useApp } from '../contexts/AppProvider'

const OptionsCard = () => {
    const { tema, handleTheme, showOptions } = useApp();
    const isDark = tema === 'oscuro';

    return (
        <AnimatePresence>
            {showOptions && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className={`absolute top-12 right-0 z-50 p-2 rounded-lg shadow-lg
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
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default OptionsCard
