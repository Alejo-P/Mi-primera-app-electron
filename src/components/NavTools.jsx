import React from 'react';
import { motion, AnimatePresence } from "framer-motion";

// Importamos las constantes
import { THEMES } from '../constants/temas';

// Importamos el contexto
import { useApp } from '../contexts/AppProvider';

const NavTools = ({ children }) => {
    const { tema, visibleToolbar } = useApp();
    const isDark = tema === THEMES.DARK; // Verificamos si el tema es oscuro
    return (
        <AnimatePresence>
            {visibleToolbar && (
                <motion.div
                    initial={{ y: -100, opacity: 0 }} // Comienza más arriba
                    animate={{ y: 0, opacity: 1 }} // Se mueve hacia su posición final
                    exit={{ y: -100, opacity: 0 }} // Se oculta subiendo
                    transition={{ 
                        type: "spring", 
                        stiffness: 120, 
                        damping: 15, 
                        duration: 0.5 
                    }}
                    className={`flex flex-col gap-3 p-3 rounded-lg 
                        shadow-[0_6px_15px_rgba(0,0,0,0.7)] transition-all duration-300 border
                        ${isDark ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}
                    `}
                >
                    <div className='flex items-center justify-between gap-3'>
                        <p className="text-sm font-semibold">Herramientas:</p>
                        {children}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default NavTools
