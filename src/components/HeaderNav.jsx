import React from 'react'
import { FaMoon } from "react-icons/fa";
import { MdOutlineWbSunny } from "react-icons/md";
import { Tooltip as ReactTooltip } from 'react-tooltip';

// Importamos el contexto
import { useApp } from '../contexts/AppProvider'

const HeaderNav = ({text}) => {
    const { tema, handleTheme } = useApp();

    return (
        <header className="bg-blue-600 text-white p-4 flex items-center justify-between">
            <h1 className="text-4xl text-center text-white font-bold uppercase bg-blue-600 p-4">
                {text}
            </h1>
            <button
                id="temaBtn"
                className="bg-gray-800 text-white p-2 rounded-lg hover:bg-gray-700 transition-all duration-300"
                title="Cambiar tema"
                data-tooltip-id="temaLabel"
                data-tooltip-content="Cambiar entre tema claro y oscuro"
                onClick={handleTheme}
            >
                {tema === 'claro' ? <MdOutlineWbSunny className="text-2xl"/> : <FaMoon className="text-2xl"/>}
            </button>
            <ReactTooltip id="temaLabel" place="top" effect="solid" className='text-white text-sm'/>
        </header>
    )
}

export default HeaderNav
