import React from 'react';
import { Loader2 } from 'lucide-react'; // Ícono de carga

// Importamos el contexto
import { useApp } from '../contexts/AppProvider';

const LoadingCard = () => {
    const { tema } = useApp();
    const isDark = tema === 'oscuro';

    return (
        <div className={`fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity animate-fadeIn`}>
            {/* Contenedor de la tarjeta de carga */}
            <div className={`rounded-lg shadow-lg p-6 flex flex-col items-center justify-center space-y-4
                ${isDark ? 'text-white bg-gray-800' : 'text-gray-900 bg-white'}
            `}>
                {/* Ícono animado */}
                <div className={`flex items-center justify-center bg-gray-200 rounded-full h-20 w-20
                    ${isDark ? 'text-white bg-gray-700' : 'text-gray-900 bg-gray-200'}
                `}>
                    <Loader2 className="w-12 h-12 animate-spin" />
                </div>
                {/* Texto */}
                <p className={`text-lg font-semibold
                    ${isDark ? 'text-white' : 'text-gray-700'}
                `}>
                    Cargando...
                </p>
            </div>
        </div>
    );
};

export default LoadingCard;
