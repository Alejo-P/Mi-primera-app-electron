import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthProvider';
import { useApp } from '../contexts/AppProvider';
import Avatar from "react-avatar";
import { IoIosSave } from "react-icons/io";

// Importamos las constantes
import { THEMES } from '../constants/temas';

// Importamos los componentes
import CustomInput from '../components/CustomInput';
import RolesField from '../components/RolesField';

const ProfilePage = () => {
    const { user, removeRole } = useAuth();
    const { tema, handleNotificacion, setNavActionsItems } = useApp();
    const isDark = tema === THEMES.DARK;

    const initialProfileInfo = {
        name: user?.name || "N/A",
        email: user?.email || "N/A",
        roles: user?.roles || "N/A",
        id: user?.id || "N/A"
    };

    const initialPasswordForm = {
        password: '',
        confirmPassword: ''
    };

    const [profileInfo, setProfileInfo] = useState(initialProfileInfo);
    const [passwordForm, setPasswordForm] = useState(initialPasswordForm);
    const [disabledProfileButton, setDisabledProfileButton] = useState(false);
    const [disabledPasswordButton, setDisabledPasswordButton] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleDeleteRole = async (role, userId) => {
        console.log(role, userId);
        if (user?.roles?.includes("Administrador") && user?.roles?.length > 1) {
            setIsLoading(true);
            await removeRole(role, userId);
            setIsLoading(false);
        } else {
            handleNotificacion('error', 'No puedes eliminar tu rol de Administrador', 5000);
        }
    };

    const handleSaveProfile = async () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            handleNotificacion('success', 'Perfil actualizado correctamente', 5000);
        }, 2000);
    };

    const handleSavePassword = async () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            handleNotificacion('success', 'Contraseña actualizada correctamente', 5000);    
        }, 2000);
    };

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (!disabledProfileButton || !disabledPasswordButton) {
                event.preventDefault();
                event.returnValue = "";
            }
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [disabledProfileButton, disabledPasswordButton]);

    useEffect(() => {
        setProfileInfo({
            name: user?.name || "N/A",
            email: user?.email || "N/A",
            roles: user?.roles || "N/A",
            id: user?.id || "N/A"
        });
    }, [user]);

    useEffect(() => {
        const isProfileChanged = JSON.stringify(profileInfo) !== JSON.stringify(initialProfileInfo);
        const { password, confirmPassword } = passwordForm;
        const isPasswordFilled = password.trim() !== '' && confirmPassword.trim() !== '';

        if (!isPasswordFilled) {
            setPasswordError('');
            setDisabledPasswordButton(false);
        } else if (password !== confirmPassword) {
            setPasswordError('Las contraseñas no coinciden');
            setDisabledPasswordButton(false);
        } else {
            setPasswordError('');
            setDisabledPasswordButton(true);
        }

        setDisabledProfileButton(isProfileChanged);
    }, [profileInfo, passwordForm]);

    useEffect(() => {
        setNavActionsItems([]);
    }, []);

    return (
        <div className={`w-full p-3 transition-all duration-300`}>
            <h2 className="text-2xl text-center font-bold mb-6">Info del perfil</h2>

            <div className="flex items-center justify-center mb-4">
                <div
                    className={`p-2 rounded-full border-4 flex items-center justify-center ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}
                    style={{
                        boxShadow: isDark ? '0 4px 6px rgba(0, 0, 0, 0.3)' : '0 4px 6px rgba(0, 0, 0, 0.1)', // Sombra suave
                        borderColor: isDark ? '#4A5568' : '#E2E8F0', // Borde ajustado al tema
                    }}
                >
                    <Avatar
                        name={user?.name || "N/A"}
                        round={true}
                        size="50"
                        maxInitials={2}
                        color={isDark ? '#2D3748' : '#F7FAFC'} // Fondo más oscuro en tema oscuro, más claro en tema claro
                        fgColor={isDark ? '#fff' : '#2D3748'} // Texto blanco en tema oscuro, texto oscuro en tema claro
                        className={`font-bold text-lg transition-all duration-300`}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Formulario de Información */}
                <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                    {[{ placeholder: "Tu nombre de usuario", name: "name", disabled: false, type: "username" },
                      { placeholder: "Tu correo electronico", name: "email", disabled: false, type: "email" },
                      { placeholder: "Tus roles", name: "roles", disabled: true, type: "security" }].map((field) => {
                        if (field.name !== "roles") {
                            return (
                                <CustomInput
                                    key={field.name}
                                    Itype={field.type}
                                    Iname={field.name}
                                    Ivalue={profileInfo[field.name]}
                                    IonChange={(e) => setProfileInfo({ ...profileInfo, [field.name]: e.target.value })}
                                    Iplaceholder={field.placeholder}
                                    Idisabled={field.disabled}
                                />
                            );
                        } else {
                            return (
                                <RolesField
                                    key={field.name}
                                    field={field}
                                    profileInfo={profileInfo}
                                    isDark={isDark}
                                    user={user}
                                    onDeleteRole={handleDeleteRole}
                                />
                            );
                        }
                    })}
                    <button
                        type="submit"
                        className={`px-4 py-2 mb-3 rounded-lg font-bold ${isDark ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} ${isLoading ? 'bg-gray-300 text-gray-500 opacity-50 cursor-not-allowed' : ''} ${disabledProfileButton ? 'opacity-100' : 'bg-gray-300 text-gray-500 opacity-50 cursor-not-allowed'}`}
                        onClick={handleSaveProfile}
                        disabled={disabledProfileButton || isLoading}
                        title={isLoading ? "Actualizando..." : "Guardar cambios"}
                    >
                        <IoIosSave className="inline-block mr-2 text-2xl" />
                        Actualizar
                    </button>
                </form>

                {/* Formulario de Contraseña */}
                <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                    {[{ placeholder: "Ingresa la nueva contraseña", name: "password", disabled: false, type: "password" },
                      { placeholder: "Ingresa nuevamente la contraseña", name: "confirmPassword", disabled: false, type: "password" }].map((field, index) => (
                        <CustomInput
                            key={index}
                            Itype={field.type}
                            Iname={field.name}
                            Ivalue={passwordForm[field.name]}
                            IonChange={(e) => setPasswordForm({ ...passwordForm, [field.name]: e.target.value })}
                            Iplaceholder={field.placeholder}
                            Idisabled={field.disabled}
                        />
                    ))}
                    {passwordError && (
                        <span className="text-red-500 text-sm font-medium -mt-2">{passwordError}</span>
                    )}
                    <button
                        type="submit"
                        className={`px-4 py-2 mb-3 rounded-lg font-bold w-full transition-all duration-300 ${isDark ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} ${isLoading ? 'bg-gray-300 text-gray-500 opacity-50 cursor-not-allowed' : ''} ${disabledPasswordButton ? 'opacity-100' : 'bg-gray-300 text-gray-500 opacity-50 cursor-not-allowed'}`}
                        onClick={handleSavePassword}
                        disabled={disabledPasswordButton || isLoading}
                        title={isLoading ? "Actualizando..." : "Cambiar contraseña"}
                    >
                        <IoIosSave className="inline-block mr-2 text-2xl" />
                        Cambiar contraseña
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;
