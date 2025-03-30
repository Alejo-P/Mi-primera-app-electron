import React, { useState } from 'react'
import { IoLogIn } from "react-icons/io5";

// Importamos el contexto
import { useApp } from '../contexts/AppProvider';
import { useAuth } from '../contexts/AuthProvider';

// Importamos los componentes
import Notification from '../components/Notification';
import CustomInput from '../components/CustomInput';

const LoginPage = () => {
    const { tema, notificacion } = useApp();
    const isDark = tema === 'oscuro';
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        login(formData);
    }

    return (
        <div className={`fixed inset-0 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity animate-fadeIn`}>
            {notificacion && <Notification {...notificacion} />}
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
                    className="w-full mt-2"
                >
                    <div className="relative mb-4">
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
                    </div>
                    <button
                        type="submit"
                        className={`mt-4 px-4 py-2 rounded-lg text-white font-bold
                            ${isDark ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'}
                        `}
                    >
                        Iniciar sesión
                    </button>
                </form>
            </div>
        </div>
    )
}

export default LoginPage
