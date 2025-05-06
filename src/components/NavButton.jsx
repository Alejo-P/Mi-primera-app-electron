import React from 'react'
import { useNavigate } from 'react-router-dom';

/** Componente reutilizable para los botones de la barra lateral */
const NavButton = ({ to, active, icon, tooltip, isDark }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (!active) {
            navigate(to);
        }
    }

    return (
        <button
            onClick={handleClick}
            className={`group h-full w-full flex flex-col items-center justify-between rounded-lg transition-transform duration-300 
                ${active ? 'bg-transparent cursor-default' : 
                    isDark ? 'bg-gray-700 text-white cursor-pointer'
                    : 'bg-gray-300 text-gray-900 hover:bg-gray-400 cursor-pointer'
                }
                hover:scale-95 shadow-lg hover:shadow-xl
            `}
        >
            <div className="w-full h-auto flex justify-center items-center p-2 flex-1">
                {icon}
            </div>
            {
                !active && (
                    <div className={`w-full h-auto group-hover:scale-x-100 transition-transform duration-300 flex
                        justify-center items-center text-xs font-semibold p-1 border-t-1 rounded-b-lg
                        ${isDark ? 'bg-gray-900 border-white' : 'bg-gray-400 border-gray-800 group-hover:bg-gray-500'}
                    `}>
                        {tooltip}
                    </div>
                )
            }
        </button>
    )
};

export default NavButton
