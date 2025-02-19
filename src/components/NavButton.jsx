import React from 'react'
import { Link } from 'react-router-dom'

/** Componente reutilizable para los botones de la barra lateral */
const NavButton = ({ to, active, icon, tooltip, tooltipId, isDark }) => (
    <Link
        to={to}
        className={`h-full w-full p-4 flex items-center justify-center rounded-lg transition-transform duration-300 
            ${active ? 'bg-transparent cursor-default' : 
                `${isDark ? 'bg-gray-700 text-white' : 'bg-gray-300 text-gray-900 hover:bg-gray-400'} 
                 hover:scale-95 shadow-lg hover:shadow-xl`}`}
        data-tooltip-id={tooltipId}
        data-tooltip-content={tooltip}
    >
        {icon}
    </Link>
);

export default NavButton
