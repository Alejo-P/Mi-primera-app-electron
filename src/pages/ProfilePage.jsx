import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppProvider';
import { FaUserCircle } from "react-icons/fa";

const ProfilePage = () => {
    const { user } = useAuth();
    const { tema } = useApp();
    const isDark = tema === 'oscuro';

    const [profileInfo, setProfileInfo] = useState({
        name: user.name || "N/A",
        email: user.email || "N/A",
        role: user.role || "N/A"
    });

    const [passwordForm, setPasswordForm] = useState({
        password: '',
        confirmPassword: ''
    });

    return (
        <div className={`w-full p-6 shadow-lg rounded-xl 
            ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} transition-all duration-300
        `}>
            <h2 className="text-2xl text-center font-bold mb-6">Info del perfil</h2>

            <div className="flex items-center justify-center mb-4">
                <FaUserCircle className="text-6xl" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Formulario de Información */}
                <form className="flex flex-col gap-4">
                    {["name", "email", "role"].map((field) => (
                        <div key={field} className="flex flex-col">
                            <label htmlFor={field} className="font-bold capitalize">{field}:</label>
                            <input
                                type={field === "email" ? "email" : "text"}
                                id={field}
                                name={field}
                                value={profileInfo[field]}
                                onChange={(e) => setProfileInfo({ ...profileInfo, [field]: e.target.value })}
                                className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    ))}
                    <button
                        type="submit"
                        className={`mt-4 px-4 py-2 rounded-lg text-white font-bold
                            ${isDark ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'}
                        `}
                    >
                        Guardar
                    </button>
                </form>

                {/* Formulario de Contraseña */}
                <form className="flex flex-col gap-4">
                    {["password", "confirmPassword"].map((field) => (
                        <div key={field} className="flex flex-col">
                            <label htmlFor={field} className="font-bold">{field === "password" ? "Contraseña" : "Confirmar contraseña"}:</label>
                            <input
                                type="password"
                                id={field}
                                name={field}
                                value={passwordForm[field]}
                                onChange={(e) => setPasswordForm({ ...passwordForm, [field]: e.target.value })}
                                className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    ))}
                    <button
                        type="submit"
                        className={`mt-4 px-4 py-2 rounded-lg text-white font-bold
                            ${isDark ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'}
                        `}
                    >
                        Cambiar contraseña
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;
