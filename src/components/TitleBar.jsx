import React, { useEffect } from 'react'
import { FaWindowMinimize, FaWindowMaximize } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { Tooltip as ReactTooltip } from 'react-tooltip';

// Importamos el contexto
import { useApp } from '../contexts/AppProvider'


const TitleBar = () => {
    const { tema, handleTheme } = useApp();
    const isDark = tema === 'oscuro';
    
    useEffect(() => {
        const { electronAPI } = window;
        
    }, []);

    return (
        <div
            className='flex flex-row justify-between w-full items-center px-4 py-2'
        >
            <div className='flex items-center space-x-2'>
                <p>
                    DocTools
                </p>

            </div>
            <div className='flex space-x-2'>
                <button
                    className='hover:bg-red-600 hover:text-gray-400 rounded-md p-1'
                    onClick={() => window.api.minimize()}
                >
                    <FaWindowMinimize />
                </button>
                <button
                    className='hover:bg-yellow-600 hover:text-gray-400 rounded-md p-1'
                    onClick={() => window.api.maximize()}
                >
                    <FaWindowMaximize />
                </button>
                <button
                    className='hover:bg-red-600 hover:text-gray-400 rounded-md p-1'
                    onClick={() => window.api.close()}
                >
                    <IoCloseSharp />
                </button>
            </div>
            <div>
                <ReactTooltip id='minimize' place='top' />
                <ReactTooltip id='maximize' place='top' />
                <ReactTooltip id='close' place='top' />
            </div>
        </div>
    )
}

export default TitleBar
