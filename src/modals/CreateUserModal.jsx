// @ts-check
import React, { useEffect, useState } from 'react'
import { IoClose } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";
import { ImSpinner9 } from "react-icons/im";

import { useApp } from '@contexts/AppProvider';
import { useAuth } from '@contexts/AuthProvider';
import CustomInput from '@components/CustomInput';

const CreateUserModal = ({
    handleModal,
    isDark
}) => {
    const { setNavActionsItems } = useApp();
    const { register } = useAuth();
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const disabled = !userData.name.trim() || !userData.email.trim() || !userData.password.trim();

    const handleClose = () => {
        setTimeout(() => handleModal(), 200);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const success = await register(userData);
        setLoading(false);
        if (success) {
            setUserData({
                name: '',
                email: '',
                password: ''
            });
            handleModal();
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value
        });
    }

    useEffect(() => {
        const acciones = [
            {
                key: 'crear',
                element: (
                    <button
                        type="submit"
                        form="createUserForm"
                        className={`p-2 rounded-lg transition-all duration-300
                            ${(disabled || loading)? 'cursor-not-allowed bg-gray-300 text-gray-500'
                                : isDark ? 'bg-green-600 text-white'
                                : 'bg-green-400 text-gray-900 hover:bg-gray-400'
                            }
                            hover:scale-95 shadow-lg hover:shadow-xl`}
                        data-tooltip-id='createQRLabel'
                        data-tooltip-content={`${!disabled ? 'Crear usuario' : 'Los campos son obligatorios'}`}
                        disabled={disabled || loading} // Deshabilitar el botón si no hay texto o si está cargando
                    >
                        {loading ? <ImSpinner9 className='animate-spin text-2xl' /> : <FaCheck className='text-2xl' />}
                    </button>
                )
            },
            {
                key: 'cerrar',
                element: (
                    <button
                        onClick={handleClose}
                        className={`p-2 rounded-lg transition-all duration-300
                            ${isDark ? 'bg-red-600 text-white' : 'bg-red-400 text-gray-900 hover:bg-gray-400'} 
                            hover:scale-95 shadow-lg hover:shadow-xl`}
                        data-tooltip-id='closeLabel'
                        data-tooltip-content='Cerrar'
                    >
                        <IoClose className='text-2xl' />
                    </button>
                )
            }
        ];
        setNavActionsItems(acciones);
        return () => {
            setNavActionsItems([]);
        };
    }, [disabled, isDark, loading]); // Se ejecuta cuando cambia el estado del formulario o el tema

    return (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center w-screen p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div className={`p-6 w-3/5 min-w-[525px] max-w-screen-xl rounded-lg shadow-lg
                ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
                relative flex flex-col items-center max-h-screen overflow-auto`}
            >
                <h2 className="text-2xl font-bold mb-4">Crear Usuario</h2>
                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4" id='createUserForm' autoComplete='off'>
                    <CustomInput
                        Itype="text"
                        Iname="name"
                        Iplaceholder="Nombre"
                        Ivalue={userData.name}
                        IonChange={handleChange}
                        Irequired
                    />
                    <CustomInput
                        Itype="email"
                        Iname="email"
                        Iplaceholder="Correo Electrónico"
                        Ivalue={userData.email}
                        IonChange={handleChange}
                        Irequired
                    />
                    <CustomInput
                        Itype="password"
                        Iname="password"
                        Iplaceholder="Contraseña"
                        Ivalue={userData.password}
                        IonChange={handleChange}
                        Irequired
                    />
                </form>
            </div>
        </div>
    )
}

export default CreateUserModal
