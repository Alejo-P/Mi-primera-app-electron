import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppProvider';
import { FaUserCircle } from "react-icons/fa";
import { MdOutlinePassword } from "react-icons/md";
import { FiUser, FiMail, FiShield } from "react-icons/fi";

const ProfilePage = () => {
    const { user } = useAuth();
    const { tema } = useApp();
    const isDark = tema === 'oscuro';

    const initialProfileInfo = {
        name: user?.name || "N/A",
        email: user?.email || "N/A",
        role: user?.role || "N/A"
    };

    const initialPasswordForm = {
        password: '',
        confirmPassword: ''
    };

    const [profileInfo, setProfileInfo] = useState(initialProfileInfo);
    const [passwordForm, setPasswordForm] = useState(initialPasswordForm);
    const [isFormDirty, setIsFormDirty] = useState(false);

    // Detectar si hubo cambios en los formularios
    useEffect(() => {
        const isProfileChanged = JSON.stringify(profileInfo) !== JSON.stringify(initialProfileInfo);
        const isPasswordChanged = JSON.stringify(passwordForm) !== JSON.stringify(initialPasswordForm);
        setIsFormDirty(isProfileChanged || isPasswordChanged);
    }, [profileInfo, passwordForm]);

    // Manejar el evento beforeunload
    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (isFormDirty) {
                event.preventDefault();
                event.returnValue = ""; // Muestra la advertencia del navegador
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [isFormDirty]);

    useEffect(() => {
        // Aqui actualizar el valor de los inputs con la info del usuario
        setProfileInfo({
            name: user?.name || "N/A",
            email: user?.email || "N/A",
            role: user?.role || "N/A"
        }); 
    }, [user]);

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
                <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                    {[
                        { icon: <FiUser className="text-2xl" />, placeholder: "Tu nombre de usuario", name: "name", disabled: false },
                        { icon: <FiMail className="text-2xl" />, placeholder: "Tu correo electronico", name: "email", disabled: false },
                        { icon: <FiShield className="text-2xl" />, placeholder: "Tu rol", name: "role", disabled: true },
                    ].map((field, index) => (
                        <>
                            <label key={index} htmlFor={field.name} className="font-bold title">{field.placeholder}:</label>
                            <div key={index} className="flex flex-col relative">
                                <input
                                    type={field.name === "email" ? "email" : "text"}
                                    id={field.name}
                                    name={field.name}
                                    value={profileInfo[field.name]}
                                    onChange={(e) => setProfileInfo({ ...profileInfo, [field.name]: e.target.value })}
                                    className={`border border-gray-300 p-2 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-300 text-gray-900'}`}
                                    placeholder={field.placeholder}
                                    title={field.placeholder}
                                    disabled={field.disabled}
                                />
                                <div className="absolute top-2 left-2 text-gray-400 group-hover:left-3 transition-all duration-300 text-center">
                                    {field.icon}
                                </div>
                            </div>
                        </>
                    ))}
                    <button
                        type="submit"
                        className={`mt-4 px-4 py-2 rounded-lg text-white font-bold
                            ${isDark ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'}
                        `}
                        onClick={() => setIsFormDirty(false)} // Resetear el estado después de guardar
                    >
                        Guardar
                    </button>
                </form>

                {/* Formulario de Contraseña */}
                <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                    {[
                        { icon: <MdOutlinePassword className="text-2xl" />, placeholder: "Ingresa la nueva contraseña", name: "password", disabled: false },
                        { icon: <MdOutlinePassword className="text-2xl" />, placeholder: "Ingresa nuevamente la contraseña", name: "confirmPassword", disabled: false },
                    ].map((field, index) => (
                        <>
                            <label key={index} htmlFor={field.name} className="font-bold">{field.name === "password" ? "Contraseña" : "Confirmar contraseña"}:</label>
                            <div key={index} className="flex flex-col relative">
                                <input
                                    type="password"
                                    id={field}
                                    name={field.name}
                                    value={passwordForm[field.name]}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, [field.name]: e.target.value })}
                                    className={`border border-gray-300 p-2 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-300 text-gray-900'}`}
                                    placeholder={field.placeholder}
                                    title={field.placeholder}
                                    disabled={field.disabled}
                                />
                                <div className="absolute top-2 left-2 text-gray-400 group-hover:left-3 transition-all duration-300 text-center">
                                    {field.icon}
                                </div>
                            </div>
                        </>
                    ))}
                    <button
                        type="submit"
                        className={`mt-4 px-4 py-2 rounded-lg text-white font-bold
                            ${isDark ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'}
                        `}
                        onClick={() => setIsFormDirty(false)} // Resetear el estado después de guardar
                    >
                        Cambiar contraseña
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;
