import React, { useEffect, useState } from 'react'
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { IoClose } from "react-icons/io5";

// Importamos las constantes
import { THEMES } from '../constants/temas';

// Importamos el contexto
import { useApp } from '../contexts/AppProvider';

// Importamos los componentes
import NavActions from '../components/NavActions';

const LogModal = () => {
    const { showLogsModal, setShowLogsModal, tema } = useApp();
    const isDark = tema === THEMES.DARK;
    const [logs, setLogs] = useState('');

    const handleClose = () => {
        setShowLogsModal(false);
    };

    useEffect(() => {
        if (showLogsModal) {
            setLogs(readLogs());
        }
    }, [showLogsModal]);

    return (
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
            
            <NavActions>
                <button
                    className={`p-2 rounded-lg transition-all duration-300
                        ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-300 text-gray-900 hover:bg-gray-400'} 
                        hover:scale-95 shadow-lg hover:shadow-xl`}
                    title="Cerrar"
                    data-tooltip-id="closeLabel"
                    data-tooltip-content="Cerrar ventana de logs"
                    onClick={handleClose}
                >
                    <IoClose className="text-2xl"/>
                </button>
                <ReactTooltip id="closeLabel" place="top" effect="solid"
                    className={`p-2 rounded-lg shadow-lg
                        ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-300 text-gray-900'}
                    `}
                />
            </NavActions>
        </div>
    )
}

export default LogModal
