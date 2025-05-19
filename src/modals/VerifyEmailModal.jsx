import React, { useEffect, useState } from 'react'
import { IoClose, IoCheckmark } from "react-icons/io5";
import { ImSpinner9 } from "react-icons/im";

import { useApp } from '@contexts/AppProvider';
import { useAuth } from '@contexts/AuthProvider';


const VerifyEmailModal = ({
    handleModal,
    token,
    isDark
}) => {
    const { setNavActionsItems } = useApp();
    const { verifyEmail } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [counter, setCounter] = useState(0);

    const handleClose = () => {
        setTimeout(() => handleModal(), 200);
    }

    const handleVerifyEmail = async () => {
        setLoading(true);
        const res = await verifyEmail(token);
        setLoading(false);
        if (res) {
            setCounter(5);
            setSuccess(true);
            setTimeout(() => handleModal(), 5000);
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setCounter((prev) => {
                if (prev <= 0) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [success]);

    useEffect(() => {
        setNavActionsItems([
            {
                key: 'cerrar',
                element: (
                    <button
                        className={`p-2 rounded-lg transition-all duration-300
                            ${(loading) ? 'cursor-not-allowed bg-gray-300 text-gray-500'
                                : isDark ? 'bg-red-600 text-white'
                                : 'bg-red-400 text-gray-900 hover:bg-gray-400'}
                            hover:scale-95 shadow-lg hover:shadow-xl`}
                        title="Guardar"
                        data-tooltip-id='guardarLabel'
                        data-tooltip-content={`${loading ? 'Cargando' : 'Cerrar'}`}
                        onClick={handleClose}
                        disabled={loading}
                    >
                        {loading
                            ? <ImSpinner9 className="animate-spin text-2xl" />
                            : <IoClose className="text-2xl" />
                        }
                    </button>
                )
            }
        ]);
        return () => {
            setNavActionsItems([]);
        }
    }, [isDark, loading]);

    useEffect(() => {
        handleVerifyEmail();
        return () => {
            setLoading(false);
        }
    }, []);

    return (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center w-screen p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div className={`p-6 w-3/5 min-w-[525px] max-w-screen-xl rounded-lg shadow-lg
                ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
                relative flex flex-col items-center max-h-screen overflow-auto`}
            >
                <h2 className="text-2xl text-center font-bold">
                    Verificacion del correo electrónico
                </h2>
                {
                    loading ? (
                        <div className="flex items-center justify-center w-full h-10 mt-4">
                            <ImSpinner9 className="animate-spin text-2xl" />
                            <p className="ml-2">
                                Verificando el correo electrónico
                            </p>
                        </div>
                    ) : success ? (
                        <div className="flex flex-col items-center justify-center w-full h-10 mt-4">
                            <div className='flex items-center justify-center'>
                                <IoCheckmark className="text-2xl text-green-500" />
                                <p className="ml-2">
                                    El correo electrónico ha sido verificado correctamente, puedes iniciar sesión ahora.
                                </p>
                            </div>
                            <p className="ml-2 mt-3 text-gray-400">
                                Redirigiendo en {counter} segundos...
                            </p>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center w-full h-10 mt-4">
                            <IoClose className="text-2xl text-red-500" />
                            <p className="ml-2">
                                No se pudo verificar el correo electrónico
                            </p>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default VerifyEmailModal
