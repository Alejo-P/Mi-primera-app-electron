import React, { useState, useEffect} from 'react'
import { FaUserCheck, FaUserMinus } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { ImSpinner9 } from "react-icons/im";

// Importamos las constantes
import { THEMES } from '@constants/temas';

// Importamos el contexto
import { useApp } from '@contexts/AppProvider';
import { useAdmin } from '@contexts/AdminProvider';

// Importamos los componentes
import CustomInput from '@components/CustomInput';

const ActionProfileModal = ({
    handleModal,
    isDark,
    userInfo,
    setUserInfo,
    actionType
}) => {
    const { setNavActionsItems } = useApp();
    const { enableUser, disableUser } = useAdmin();
    const [reason, setReason] = useState('');
    const [disabled, setDisabled] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleClose = () => {
        setTimeout(() => {
            handleModal();
        }, 200);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        let success = false;
        if (actionType === 'enable') {
            success = await enableUser(userInfo.id, reason);
            if (success) {
                setUserInfo({
                    ...userInfo,
                    is_active: true
                });
                handleClose();
            }
        } else if (actionType === 'disable') {
            success = await disableUser(userInfo.id, reason);
            if (success) {
                setUserInfo({
                    ...userInfo,
                    is_active: false
                });
                handleClose();
            }
        }
        setLoading(false);
    }

    useEffect(() => {
        setDisabled(reason === '');
    }, [reason]);

    useEffect(() => {
        const acciones = [
            {
                key: 'accion',
                element: (
                    <button
                        type='submit'
                        form='actionForm'
                        className={`p-2 rounded-lg transition-all duration-300
                            ${disabled || loading ? 'cursor-not-allowed bg-gray-300 text-gray-500'
                            : isDark ? 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-95'
                            : 'bg-blue-400 text-gray-900 hover:bg-blue-500 hover:scale-95'
                            }
                            shadow-lg hover:shadow-xl`}
                        disabled={disabled || loading}
                        title={"Action"}
                        data-tooltip-id='actionLabel'
                        data-tooltip-content={`${disabled ? 'Completa todos los campos' : 'Realizar acción'}`}
                    >
                        {loading ? <ImSpinner9 className="animate-spin text-2xl" /> : actionType === 'enable' ? <FaUserCheck className="text-2xl" /> : <FaUserMinus className="text-2xl" />}
                    </button>
                )
            },
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
                        {<IoClose className="text-2xl" />}
                    </button>
                )
            }
        ]
        setNavActionsItems(acciones);
        return () => {
            setNavActionsItems([]);
        }
    }, [disabled, loading, actionType]);

    return (
        <div className={`fixed inset-0 flex flex-col w-screen items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity animate-fadeIn z-40`}>
            <div className={`p-6 rounded-lg shadow-lg w-3/5 min-w-[525px] max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl
                ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
                relative flex flex-col items-center max-h-screen overflow-auto`
            }>
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {actionType === 'enable' ? 'Activar usuario' : 'Desactivar usuario'}
                </h2>
                <form id='actionForm' onSubmit={handleSubmit} className='flex flex-col gap-4 w-full mt-4'>
                    <p className={`text-center ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {`¿Estás seguro de que deseas ${actionType === 'enable' ? 'activar' : 'desactivar'} a `}
                        <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {userInfo.name}
                        </span>
                        {`?`}
                    </p>
                    <CustomInput
                        Itype='text'
                        Ilabel='Razón'
                        Ivalue={reason}
                        IsetValue={setReason}
                        IonChange={(e) => setReason(e.target.value)}
                        Iplaceholder='Escribe la razón aquí...'
                        IisDark={isDark}
                        Irequired
                    />
                </form>
            </div>
        </div>
    )
}

export default ActionProfileModal
