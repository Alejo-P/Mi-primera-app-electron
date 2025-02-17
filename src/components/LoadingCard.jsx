import React from 'react';
import { Loader2 } from 'lucide-react'; // Ícono de carga

const LoadingCard = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity animate-fadeIn">
            {/* Contenedor de la tarjeta de carga */}
            <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center justify-center space-y-4">
                {/* Ícono animado */}
                <div className="flex items-center justify-center bg-gray-200 rounded-full h-20 w-20">
                    <Loader2 className="w-12 h-12 text-gray-900 animate-spin" />
                </div>
                {/* Texto */}
                <p className="text-gray-700 text-lg font-semibold">Cargando...</p>
            </div>
        </div>
    );
};

export default LoadingCard;
