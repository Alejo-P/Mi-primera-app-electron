import React, { useState } from 'react'
import { IoLogIn } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { IoIosEye, IoIosEyeOff } from "react-icons/io";

// Importamos el contexto
import { useApp } from '../contexts/AppProvider';
import { useAuth } from '../contexts/AuthContext';

// Importamos los componentes
import Notification from '../components/Notification';

const LoginPage = () => {
    const { tema, notificacion } = useApp();
    const isDark = tema === 'oscuro';
    const navigate = useNavigate();
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
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
                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        className={`w-full px-4 py-2 rounded-lg border-2 mb-2
                            ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}
                        `}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Contraseña"
                            className={`w-full px-4 py-2 rounded-lg border-2 mb-2
                                ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}
                            `}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                        <div
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-2 cursor-pointer"
                        >
                            {showPassword ? <IoIosEyeOff className="text-xl" /> : <IoIosEye className="text-xl" />}
                        </div>
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
