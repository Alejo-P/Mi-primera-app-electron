import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Avatar from "react-avatar";
import { FaWindowMinimize, FaWindowMaximize } from "react-icons/fa";
import { FaWindowRestore } from "react-icons/fa6";
import { SlOptions } from "react-icons/sl";
import { IoClose } from "react-icons/io5";
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { useApp } from '@contexts/AppProvider';
import { THEMES } from '@constants/temas';
import { ImSpinner9 } from "react-icons/im";

// Importamos los componentes
import { useAuth } from '@contexts/AuthProvider';
import OptionsCard from './OptionsCard';

const TitleBar = () => {
    const { user, loading } = useAuth();
    const {
        showOptions,
        handleOptions,
        isMaximized,
        setIsMaximized,
        isElectron,
        tema
    } = useApp();
    const navigate = useNavigate();
    const { pathname } = useLocation(); // Obtenemos la ruta actual
    const [isProfilePage, setIsProfilePage] = useState(false); // Estado para verificar si estamos en la página de perfil
    const isDark = tema === THEMES.DARK; // Verificamos si el tema es oscuro

    useEffect(() => {
        // Verificamos si estamos en la página de perfil
        setIsProfilePage(pathname === `/dashboard/profile/${user?.id}`);
    }, [pathname, user]); // Se ejecuta cuando cambia la ruta

    useEffect(() => {
        const { electronAPI } = window;

        // Verificar si la ventana ya está maximizada al iniciar
        if (electronAPI?.isWindowMaximized) {
            electronAPI.isWindowMaximized().then(setIsMaximized);
        }

        // Escuchar eventos de la ventana
        electronAPI?.onMaximize(() => setIsMaximized(true));
        electronAPI?.onUnmaximize(() => setIsMaximized(false));

        return () => {
            electronAPI?.removeAllListeners('maximize');
            electronAPI?.removeAllListeners('unmaximize');
        };
    }, []);

    return (
        <>
            <div className='flex flex-row justify-between w-full items-center px-4 py-1' style={{ WebkitAppRegion: 'drag' }}>
                <div className='flex items-center space-x-2 font-bold' style={{ WebkitAppRegion: 'no-drag' }}>
                    <p>DocTools</p>
                </div>
                {
                    pathname.includes("/dashboard") && (
                        <div
                            className={`flex items-center justify-center space-x-2 rounded-lg
                                ${isDark ? 'text-gray-200' : 'text-gray-900'}
                                ${loading ? 'animate-pulse cursor-not-allowed'
                                    : isProfilePage ? 'cursor-default' : 'cursor-pointer hover:text-gray-400 hover:scale-95'
                                }
                                transition-all duration-300
                            `}
                            data-tooltip-id='profile'
                            data-tooltip-content={`${loading ? 'Cargando...' : isProfilePage ? 'Tu perfil' : Object.keys(user).length > 0 ? 'Ir a tu perfil' : 'Ningun perfil disponible'}`}
                            style={{ WebkitAppRegion: 'no-drag' }}
                            onClick={() => {
                                if (!loading && !isProfilePage && Object.keys(user).length > 0) {
                                    // Si no estamos en la página de perfil y hay informacion del usuario, navegamos a su perfil
                                    navigate(`/dashboard/profile/${user?.id}`);
                                }
                            }}
                        >
                            {
                                loading ? <ImSpinner9 className='animate-spin text-xl' />
                                :
                                <div
                                    className={`flex items-center justify-center w-7 h-7 p-0 rounded-full overflow-hidden border-2
                                        ${isDark ? 'border-gray-600' : 'border-gray-300'} transition-all duration-300`}
                                    style={{ WebkitAppRegion: 'no-drag' }}>
                                    {/* Avatar del usuario con fondo y texto según el tema */}
                                    <Avatar
                                        src={user?.avatar?.url || ''}
                                        name={user?.name || "N/A"}
                                        round={true}
                                        size="30"
                                        maxInitials={2}
                                        color={isDark ? '#2D3748' : '#F7FAFC'} // Fondo más oscuro en tema oscuro, más claro en tema claro
                                        fgColor={isDark ? '#fff' : '#2D3748'} // Texto blanco en tema oscuro, texto oscuro en tema claro
                                        className={`transition-all duration-300 font-bold text-lg`}
                                        style={{
                                            padding: 0,
                                        }}
                                    />
                                </div>
                            }
                            <span
                                className='text-sm font-semibold'
                            >
                                {loading ? 'Cargando...' : user?.name || 'Invitado'}
                            </span>
                        </div>
                    )
                }
                <div className='flex space-x-2 h-full items-center' style={{ WebkitAppRegion: 'no-drag' }}>
                    <button
                        id='options'
                        data-tooltip-id='options'
                        data-tooltip-content={`Mas opciones`}
                        className='hover:text-gray-400 rounded-md p-2'
                        onClick={handleOptions}
                    >
                        <SlOptions />
                    </button>
                    {
                        isElectron && (
                            <>
                                <button
                                    id='minimize'
                                    data-tooltip-id='minimize'
                                    data-tooltip-content={`Minimizar`}
                                    onClick={() => window.electronAPI.minimize()}
                                    className='hover:bg-gray-600 hover:text-gray-400 rounded-md p-2'
                                >
                                    <FaWindowMinimize />
                                </button>
                                <button
                                    id='maximize'
                                    data-tooltip-id='maximize'
                                    data-tooltip-content={isMaximized ? `Restaurar` : `Maximizar`}
                                    onClick={() => isMaximized ? window.electronAPI.unmaximize() : window.electronAPI.maximize()}
                                    className='hover:bg-gray-600 hover:text-gray-400 rounded-md p-2'
                                >
                                    {isMaximized ? <FaWindowRestore /> : <FaWindowMaximize />}
                                </button>
                                <button
                                    id='close'
                                    data-tooltip-id='close'
                                    data-tooltip-content={`Cerrar`}
                                    onClick={() => window.electronAPI.close()}
                                    className='hover:bg-red-600 hover:text-gray-400 rounded-md p-2'
                                >
                                    <IoClose className='font-semibold' />
                                </button>
                            </>
                        )
                    }
                    
                </div>
                <ReactTooltip id='minimize' place='top' />
                <ReactTooltip id='maximize' place='top' />
                <ReactTooltip id='close' place='top' />
                <ReactTooltip id='options' place='top' />
                <ReactTooltip id='profile' place='top' />
            </div>
            {showOptions && <OptionsCard />}
        </>
    );
}

export default TitleBar;
