import React from 'react'
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from 'react-icons/fa';

import { ROLES } from '@constants/roles';
import NavButton from '@components/NavButton';

const SideBar = ({
    isDark,
    groupedItems,
    user,
    handleDrawer,
    drawerOpen
}) => {
    return (
        <AnimatePresence>
            {drawerOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-50"
                >
                    {/* Fondo oscurecido */}
                    <div 
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"
                        onClick={handleDrawer}
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: -300 }}
                        animate={{ x: 0 }}
                        exit={{ x: -300 }}
                        transition={{ duration: 0.3 }}
                        className={`absolute top-10 left-0 h-[calc(100%-40px)] w-64 shadow-lg z-50 border-t border-r border-b
                            ${isDark ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}
                            rounded-tr-lg rounded-br-lg p-2 overflow-y-auto scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar
                        `}
                    >
                        {/* Contenido del Drawer */}
                        <div className="flex flex-col gap-2 items-center justify-between p-2 w-full mt-13 mb-2">
                            {Object.entries(groupedItems).map(([role, items]) => (
                                <div key={role} className="flex flex-col gap-2 w-full items-center">
                                    {user?.roles.includes(ROLES.ADMIN) && (
                                        <div className={`text-sm font-semibold uppercase text-center mb-1 px-3 py-1 rounded shadow
                                            ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'}`}>
                                            Acceso para {role === ROLES.ADMIN ? 'administradores' : 'usuarios'}
                                        </div>
                                    )}
                                    {items.map(item => (
                                        <NavButton
                                            key={item.path}
                                            to={item.path}
                                            active={item.active}
                                            icon={item.icon}
                                            tooltip={item.tooltip}
                                            isDark={isDark}
                                            onNavigate={handleDrawer}
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default SideBar
