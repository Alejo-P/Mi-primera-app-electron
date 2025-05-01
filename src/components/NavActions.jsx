import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip as ReactTooltip } from 'react-tooltip';

// Importamos las constantes
import { THEMES } from '../constants/temas';

// Importamos el contexto
import { useApp } from '../contexts/AppProvider';

const NavActions = () => {
    const { tema, visibleNav, navActionsItems } = useApp();
    const isDark = tema === THEMES.DARK;
    const [tooitips, setTooitips] = useState([]);

    useEffect(() => {
        // Verificamos si hay tooltips en los elementos de navActionsItems (si no hay, no se renderiza el tooltip)
        const tooltipsElements = navActionsItems.map(({ key, element }) => {
            const tooltip = element.props['data-tooltip-id'];
            return tooltip ? { key, tooltip } : null;
        });
        setTooitips(tooltipsElements.filter(Boolean)); // Filtramos los elementos nulos
    }, [navActionsItems]);

    return (
        <AnimatePresence>
            {visibleNav && navActionsItems.length > 0 && (
                <motion.div
                    layout
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 40, opacity: 0, scale: 0.9 }} // <- esto le da más "vida"
                    transition={{ 
                        type: "spring",
                        stiffness: 120, 
                        damping: 15,
                        duration: 0.4 // <- más tiempo para que no sea tan brusco
                    }}
                    className={`fixed bottom-6 right-6 flex flex-col gap-3 p-3 rounded-lg z-100
                        shadow-[0_6px_15px_rgba(0,0,0,0.7)] transition-all duration-300 border
                        ${isDark ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}
                    `}
                >
                    <div className='flex items-center justify-between gap-3'>
                        <p className="text-sm font-semibold">Acciones:</p>
                        <AnimatePresence>
                            {navActionsItems.map(({ key, element }) => (
                            <motion.div
                                key={key}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.25 }}
                            >
                                {element}
                            </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                    {tooitips.map(({ key, tooltip }) => (
                        <ReactTooltip
                            key={key}
                            id={tooltip}
                            place="top"
                            effect="solid"
                            className={`text-xs font-semibold ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
                        />
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default NavActions;
