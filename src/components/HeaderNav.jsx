import React from 'react'
import { FaMoon } from "react-icons/fa";
import { MdOutlineWbSunny } from "react-icons/md";
import { Tooltip as ReactTooltip } from 'react-tooltip';

// Importamos el contexto
import { useApp } from '../contexts/AppProvider'

const HeaderNav = ({text, isDark}) => {
    const { tema, handleTheme } = useApp();

    return (
        <div className={`flex items-center justify-between gap-3 p-3 rounded-lg`}>
            <h1 className={`text-4xl text-center flex-1 font-bold uppercase ${isDark ? 'text-white' : 'text-gray-900'} transition-all duration-300`}>
                {text}
            </h1>
            <div className={`flex items-center justify-between gap-3 p-4 rounded-lg border shadow-lg 
                ${isDark ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300 shadow-md'} transition-all duration-300`}
            >
                <p className="text-sm font-semibold">Opciones:</p>
                <button
                    id="temaBtn"
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
                <ReactTooltip id="temaLabel" place="top" effect="solid" className='text-white text-sm'/>
            </div>
        </div>
    )
}

export default HeaderNav
