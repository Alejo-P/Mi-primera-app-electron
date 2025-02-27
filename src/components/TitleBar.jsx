import React, { useEffect, useState } from 'react';
import { FaWindowMinimize, FaWindowMaximize } from "react-icons/fa";
import { FaWindowRestore } from "react-icons/fa6";
import { SlOptions } from "react-icons/sl";
import { IoClose } from "react-icons/io5";
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { useApp } from '../contexts/AppProvider';

// Importamos los componentes
import OptionsCard from './OptionsCard';

const TitleBar = () => {
    const { showOptions, handleOptions } = useApp();
    const [isMaximized, setIsMaximized] = useState(false);

    useEffect(() => {
        const { electronAPI } = window;

        // Escuchar eventos de la ventana
        electronAPI.onMaximize(() => setIsMaximized(true));
        electronAPI.onUnmaximize(() => setIsMaximized(false));

        return () => {
            electronAPI.removeAllListeners('maximize');
            electronAPI.removeAllListeners('unmaximize');
        };
    }, []);

    return (
        <>
            <div className='flex flex-row justify-between w-full items-center px-4 py-2'>
                <div className='flex items-center space-x-2 font-bold'>
                    <p>DocTools</p>
                </div>
                <div className='flex items-end space-x-2'>
                    
                </div>
                <div className='flex space-x-2 h-full'>
                    <button
                        id='options'
                        data-tooltip-id='options'
                        data-tooltip-content={`Mas opciones`}
                        className='hover:bg-gray-600 hover:text-gray-400 rounded-md p-1'
                        onClick={handleOptions}
                    >
                        <SlOptions />
                    </button>
                    <button
                        id='minimize'
                        data-tooltip-id='minimize'
                        data-tooltip-content={`Minimizar`}
                        onClick={() => window.electronAPI.minimize()}
                        className='hover:bg-gray-600 hover:text-gray-400 rounded-md p-1'
                    >
                        <FaWindowMinimize />
                    </button>
                    <button
                        id='maximize'
                        data-tooltip-id='maximize'
                        data-tooltip-content={isMaximized ? `Restaurar` : `Maximizar`}
                        onClick={() => isMaximized ? window.electronAPI.unmaximize() : window.electronAPI.maximize()}
                        className='hover:bg-gray-600 hover:text-gray-400 rounded-md p-1'
                    >
                        {isMaximized ? <FaWindowRestore /> : <FaWindowMaximize />}
                    </button>
                    <button
                        id='close'
                        data-tooltip-id='close'
                        data-tooltip-content={`Cerrar`}
                        onClick={() => window.electronAPI.close()}
                        className='hover:bg-red-600 hover:text-gray-400 rounded-md p-1'
                    >
                        <IoClose className='font-semibold' />
                    </button>
                </div>
                <ReactTooltip id='minimize' place='top' />
                <ReactTooltip id='maximize' place='top' />
                <ReactTooltip id='close' place='top' />
                <ReactTooltip id='options' place='top' />
            </div>
            {showOptions && <OptionsCard />}
        </>
    );
}

export default TitleBar;
