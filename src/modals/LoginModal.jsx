import React, { useState, useEffect } from 'react'
import { IoLogIn } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { ImSpinner9 } from "react-icons/im";

// Importamos las constantes
import { THEMES } from '../constants/temas';

// Importamos el contexto
import { useApp } from '../contexts/AppProvider';
import { useAuth } from '../contexts/AuthProvider';

// Importamos los componentes
import CustomInput from '../components/CustomInput';

const LoginModal = ({ handleModal }) => {
    const { tema, setNavActionsItems } = useApp();
    const isDark = tema === THEMES.DARK;
    const { login, loading } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [disabled, setDisabled] = useState(false);

    const handleClose = () => {
        setTimeout(() => {
            handleModal();
        }, 200);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        login(formData);
    }

    useEffect(() => {
        setDisabled(formData.email === '' || formData.password === '');
    }, [formData]);

    useEffect(() => {
        const acciones = [
            {
                key: 'login',
                element: (
                    <button
                        type='submit'
                        form='loginForm'
                        className={`p-2 rounded-lg transition-all duration-300
                            ${disabled || loading ? 'cursor-not-allowed bg-gray-300 text-gray-500'
                            : isDark ? 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-95'
                            : 'bg-blue-400 text-gray-900 hover:bg-blue-500 hover:scale-95'
                            }
                            shadow-lg hover:shadow-xl`}
                        disabled={disabled || loading}
                        title={"Login"}
                        data-tooltip-id='loginLabel'
                        data-tooltip-content={`${disabled ? 'Completa todos los campos' : 'Iniciar sesión'}`}
                    >
                        {loading ? <ImSpinner9 className="animate-spin text-2xl" /> : <IoLogIn className="text-2xl" />}
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
                        title="Cerrar"
                        data-tooltip-id='cerrarLabel'
                        data-tooltip-content="Cerrar"
                    >
                        <IoClose className="text-2xl" />
                    </button>
                )
            }
        ];
        setNavActionsItems(acciones);
        return () => {
            setNavActionsItems([]);
        }
    }, [loading, disabled, isDark]);

    return (
        <div className={`fixed inset-0 flex flex-col w-screen items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity animate-fadeIn z-40`}>
            <div className={`p-6 rounded-lg shadow-lg w-3/5 min-w-[525px] max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl
                ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
                relative flex flex-col items-center max-h-screen overflow-auto`
            }>
                <IoLogIn className="text-5xl text-blue-500" />
                <h2 className="text-xl md:text-2xl text-center font-bold">
                    Iniciar sesión
                </h2>
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4 w-full mt-4"
                    id="loginForm"
                    autoComplete="off"
                >
                    {[
                        { placeholder: "Tu correo electronico", name: "email", disabled: false },
                        { placeholder: "Tu contraseña", name: "password", disabled: false },
                    ].map((field, index) => (
                        <CustomInput
                            key={index}
                            Itype={field.name}
                            Iname={field.name}
                            Ivalue={formData[field.name]}
                            IonChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                            Iplaceholder={field.placeholder}
                            Idisabled={field.disabled}
                        />
                    ))}
                </form>
            </div>
        </div>
    )
}

export default LoginModal
