import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from '../contexts/AppProvider';

const NavActions = ({ children }) => {
    const { tema } = useApp();
    const isDark = tema === 'oscuro';

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }} // Comienza más abajo
                animate={{ y: 0, opacity: 1 }} // Se mueve hacia su posición final
                exit={{ y: 100, opacity: 0 }} // Se oculta bajando
                transition={{ 
                    type: "spring", 
                    stiffness: 120, 
                    damping: 15, 
                    duration: 0.5 
                }}
                className={`fixed bottom-6 right-6 flex flex-col gap-3 p-3 rounded-lg 
                    shadow-[0_6px_15px_rgba(0,0,0,0.7)] transition-all duration-300 border
                    ${isDark ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}
                `}
            >
                <div className='flex items-center justify-between gap-3'>
                    <p className="text-sm font-semibold">Acciones:</p>
                    {children}
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default NavActions;
