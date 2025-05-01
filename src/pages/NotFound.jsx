import React, { useEffect } from 'react'
import { TiInfoLarge } from "react-icons/ti";
import { useNavigate } from 'react-router-dom';

// Importamos las constantes
import { THEMES } from '../constants/temas';

// Importamos el contexto
import { useApp } from '../contexts/AppProvider';

const NotFound = () => {
    const { tema, setNavActionsItems } = useApp();
    const navigate = useNavigate();
    const isDark = tema === THEMES.DARK;

    const handleNavigate = () => {
        navigate('/dashboard/');
    }

    useEffect(() => {
        const acciones = [
            {
                key: 'volver',
                element: (
                    <button
                        onClick={handleNavigate}
                        className={`p-2 rounded-lg transition-all duration-300
                            ${isDark ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-blue-400 text-gray-900 hover:bg-blue-500'}
                            shadow-lg hover:shadow-xl`}
                        title={"Volver"}
                        data-tooltip-id='volverLabel'
                        data-tooltip-content={`Volver a la página principal`}
                    >
                        <TiInfoLarge className="text-xl" />
                    </button>
                )
            }
        ];
        setNavActionsItems(acciones);
    }, [isDark]); // Se ejecuta cuando cambia el tema

    return (
        <div className={`fixed inset-0 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity animate-fadeIn z-40`}>
            <div
                className={`p-6 rounded-lg shadow-lg w-3/5 min-w-[525px] max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl
                    ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
                    relative flex flex-col items-center max-h-screen overflow-auto`
                }
            >
                <TiInfoLarge className="text-5xl text-blue-500" />
                <h2 className="text-xl md:text-2xl text-center font-bold">
                    Página no encontrada
                </h2>
                <p className="text-center mt-2">
                    La página que buscas no existe. Por favor, verifica la URL.
                </p>
                <p className={`text-center mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Si has llegado aquí por error, es posible que la página haya sido eliminada o movida.
                    Si crees que esto es un error, por favor contacta al administrador del sistema.
                </p>
                <p className={`text-center mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Puedes volver a la página principal haciendo clic en el botón de abajo.
                </p>
            </div>
        </div>
    )
}

export default NotFound
