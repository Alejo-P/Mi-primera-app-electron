import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom'
import { IoIosSave } from "react-icons/io";
import { IoWarning } from "react-icons/io5";
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { ImSpinner9 } from "react-icons/im";

// Importamos los contextos
import { useAuth } from '@contexts/AuthProvider';
import { useApp } from '@contexts/AppProvider';
import { useAdmin } from '@contexts/AdminProvider';

// Importamos las constantes
import { THEMES } from '@constants/temas';
import { ROLES } from '@constants/roles';

// Importamos los componentes
import CustomInput from '@components/CustomInput';
import RolesField from '@components/RolesField';
import UploadAvatarModal from '@modals/UploadAvatarModal';
import UserAvatar from '@components/UserAvatar';
import LoadingCard from '@components/LoadingCard';
import RoleActionModal from '@modals/RoleActionModal';

const ProfilePage = () => {
    const { user, updateProfile, updatePassword } = useAuth();
    const { tema, setNavActionsItems } = useApp();
    const { getUserById, rolesList, removeRole, getRolesList } = useAdmin();
    const [loading, setLoading] = useState(false);
    const [showRolesModal, setShowRolesModal] = useState(false);
    const { userID } = useParams();
    const isDark = tema === THEMES.DARK;

    const initialProfileInfoRef = useRef({});

    const initialPasswordForm = {
        password: '',
        newPassword: '',
        confirmPassword: ''
    };

    const [profileInfo, setProfileInfo] = useState();
    const [passwordForm, setPasswordForm] = useState(initialPasswordForm);
    const [disabledProfileButton, setDisabledProfileButton] = useState(false);
    const [disabledPasswordButton, setDisabledPasswordButton] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showUploadAvatarModal, setShowUploadAvatarModal] = useState(false);

    const handleAvatarModal = () => {
        setShowUploadAvatarModal(!showUploadAvatarModal);
    };

    const handleRolesModal = () => {
        setShowRolesModal(!showRolesModal);
    }

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        await updateProfile(profileInfo);
        setIsLoading(false);
    };

    const handleSavePassword = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const data = {
            current_password: passwordForm.password,
            new_password: passwordForm.newPassword,
            confirm_password: passwordForm.confirmPassword
        };
        await updatePassword(data);
        setIsLoading(false);
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
        const isProfileChanged = JSON.stringify(profileInfo) !== JSON.stringify(initialProfileInfoRef.current);
        const { password, newPassword, confirmPassword } = passwordForm;
        const isPasswordFilled = password.trim() !== '' && newPassword.trim() !== '' && confirmPassword.trim() !== '';

        if (!isPasswordFilled) {
            setPasswordError('');
            setDisabledPasswordButton(true);
        } else if (newPassword !== confirmPassword) {
            setPasswordError('Las contraseñas no coinciden');
            setDisabledPasswordButton(true);
        } else if (newPassword === password) {
            setPasswordError('La nueva contraseña no puede ser igual a la actual');
            setDisabledPasswordButton(true);
        }
        else if (newPassword.length > 20 || password.length > 20) {
            setPasswordError('La contraseña no puede tener más de 20 caracteres');
            setDisabledPasswordButton(true);
        } else if (newPassword.length < 8 || password.length < 8) {
            setPasswordError('La contraseña debe tener al menos 8 caracteres');
            setDisabledPasswordButton(true);
        } else {
            setPasswordError('');
            setDisabledPasswordButton(false);
        }

        setDisabledProfileButton(!isProfileChanged);
    }, [profileInfo, passwordForm]);

    useEffect(() => {
        if (!showUploadAvatarModal && !showRolesModal) {
            setNavActionsItems([]);
        } 
    }, [showUploadAvatarModal, showRolesModal]);

    // Cargar la información del usuario al cargar la página
    useEffect(()=> {
        const loadUserProfile = async () => {
            // Si el ID de usuario en la URL es diferente al del usuario actual, actualizamos la información
            setProfileInfo(null);
            setLoading(true);

            // Si el usuario es un admin, cargamos la lista de roles
            if (Object.keys(user).length && !rolesList.length && user?.roles?.includes(ROLES.ADMIN)) await getRolesList();

            if (parseInt(userID) !== user?.id) {
                const userProfile = await getUserById(userID);
                if (userProfile) {
                    const newProfile = {
                        name: userProfile?.name || "N/A",
                        email: userProfile?.email || "N/A",
                        roles: userProfile?.roles || "N/A",
                        id: userProfile?.id || "N/A",
                        is_verified: userProfile?.is_verified || false,
                        avatar: userProfile?.avatar || null
                    };
                    initialProfileInfoRef.current = newProfile;
                    setProfileInfo(newProfile);
                    console.log("Perfil cargado:", newProfile);
                }
            } else {
                // Si el ID de usuario en la URL es el mismo que el del usuario actual, cargamos la información del usuario actual
                const currentProfile = {
                    name: user?.name || "N/A",
                    email: user?.email || "N/A",
                    roles: user?.roles || "N/A",
                    id: user?.id || "N/A",
                    is_verified: user?.is_verified || false,
                    avatar: user?.avatar || null
                };
                initialProfileInfoRef.current = currentProfile;
                setProfileInfo(currentProfile);
                console.log("Perfil actual:", currentProfile);
            }
            setLoading(false);
        };
        loadUserProfile();
    }, [userID, user]); // Se ejecuta cuando cambia la ruta

    return (
        <div className={`w-full p-3 transition-all duration-300`}>
            <h2 className="text-2xl text-center font-bold mb-6">Info del perfil</h2>
            { loading ? (
                <LoadingCard />
            ) : profileInfo ? (
                <>
                    {
                        !profileInfo.is_verified && (
                            <div
                                className={`flex flex-col items-center justify-center w-full p-2 rounded-lg shadow-lg transition-all duration-300
                                ${isDark ? 'bg-orange-800 text-white'
                                    : 'bg-orange-400 text-gray-900'
                                }
                                flex flex-row items-center max-h-screen overflow-auto border-2 border-orange-500
                                `}
                            >
                                <IoWarning className="text-3xl" />
                                <p className="text-center italic font-semibold">
                                    Tu cuenta no está verificada. Por favor verifica tu correo electrónico para activar tu cuenta.
                                </p>
                            </div>
                        )
                    }

                    <div className="flex items-center justify-center mb-4 mt-4">
                        {/* Avatar del usuario */}
                        <UserAvatar
                            user={profileInfo}
                            isDark={isDark}
                            onClick={handleAvatarModal}
                            isLoading={isLoading}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Formulario de Información */}
                        <form className="flex flex-col gap-4" onSubmit={handleSaveProfile} autoComplete='off'>
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
                                            isDark={isDark}
                                            userId={profileInfo.id}
                                            values={profileInfo.roles}
                                            isAdmin={user?.roles?.includes(ROLES.ADMIN)}
                                            onClick={() => handleRolesModal()}
                                        />
                                    );
                                }
                            })}
                            <button
                                type="submit"
                                className={`px-4 py-2 mb-3 rounded-lg font-bold transition-all duration-300
                                    ${disabledProfileButton || isLoading ? 'bg-gray-300 text-gray-500 opacity-50 cursor-not-allowed'
                                        : isDark ? 'bg-blue-500 hover:bg-blue-600'
                                        : 'bg-blue-600 hover:bg-blue-700'
                                    }
                                `}
                                disabled={disabledProfileButton || isLoading}
                                title={isLoading ? "Actualizando..." : "Guardar cambios"}
                            >
                                <IoIosSave className="inline-block mr-2 text-2xl" />
                                Actualizar
                            </button>
                        </form>

                        {/* Formulario de Contraseña */}
                        <form className="flex flex-col gap-4" onSubmit={handleSavePassword} autoComplete='off'>
                            {[
                                { placeholder: "Ingresa tu contraseña actual", name: "password", disabled: false, type: "password" },
                                { placeholder: "Ingresa la nueva contraseña", name: "newPassword", disabled: false, type: "password" },
                                { placeholder: "Ingresa nuevamente la contraseña", name: "confirmPassword", disabled: false, type: "password" }
                            ].map((field, index) => (
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
                                className={`px-4 py-2 mb-3 rounded-lg font-bold transition-all duration-300
                                    ${disabledPasswordButton || isLoading ? 'bg-gray-300 text-gray-500 opacity-50 cursor-not-allowed'
                                        : isDark ? 'bg-blue-500 hover:bg-blue-600'
                                        : 'bg-blue-600 hover:bg-blue-700'
                                    }
                                `}
                                disabled={disabledPasswordButton || isLoading}
                                title={isLoading ? "Actualizando..." : "Cambiar contraseña"}
                            >
                                <IoIosSave className="inline-block mr-2 text-2xl" />
                                Cambiar contraseña
                            </button>
                        </form>
                    </div>
                </>
            ) : (
                <div
                    className={`flex flex-col items-center justify-center w-full p-2 rounded-lg shadow-lg transition-all duration-300
                    ${isDark ? 'bg-red-800 text-white'
                        : 'bg-red-400 text-gray-900'
                    }
                    flex flex-row items-center max-h-screen overflow-auto border-2 border-red-500
                    `}
                >
                    <IoWarning className="text-3xl" />
                    <p className="text-center italic font-semibold">
                        No se pudo obtener la información del perfil.
                    </p>
                </div>
            )}
            {showUploadAvatarModal && (
                <UploadAvatarModal
                    handleModal={handleAvatarModal}
                />
            )}
            {showRolesModal && (
                <RoleActionModal
                    handleModal={handleRolesModal}
                    userInfo={profileInfo}
                    isAdmin={user?.roles?.includes(ROLES.ADMIN)}
                    isDark={isDark}
                    roleList={rolesList}
                />
            )}
        </div>
    );
};

export default ProfilePage;
