import React, { useState, useEffect, Fragment } from 'react'
import { IoClose } from "react-icons/io5";
import { ImSpinner9 } from "react-icons/im";
import { LuShieldPlus, LuShieldMinus, LuShieldEllipsis } from "react-icons/lu";

// Importamos las constantes
import { THEMES } from '@constants/temas';

// Importamos el contexto
import { useApp } from '@contexts/AppProvider';
import { useAuth } from '@contexts/AuthProvider';
import { useAdmin } from '@contexts/AdminProvider';

// Importamos los componentes
import CustomInput from '@components/CustomInput';
import RolesField from '@components/RolesField';

const RoleActionModal = ({
    handleModal,
    roleList,
    userInfo,
    isAdmin,
    isDark
}) => {
    const { setNavActionsItems } = useApp();
    const { getUserById, rolesList, removeRole, addRole } = useAdmin();
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const roleNames = roleList.filter((role) => !userInfo.roles.includes(role.name)).map((role) => role.name);

    const handleClose = () => {
        setTimeout(() => {
            handleModal('');
        }, 200);
    }

    const handleSelectRole = (role) => {
        setSelectedRoles((prev) => {
            if (prev.includes(role)) {
                return prev.filter((r) => r !== role);
            } else {
                return [...prev, role];
            }
        });
    }

    const handleAddRole = async () => {
        console.log('Adding roles:', selectedRoles);
    }

    useEffect(() => {
        const acciones = [
            {
                key: 'guardar',
                element: (
                    <button
                        type='submit'
                        form='rolesForm'
                        className={`p-2 rounded-lg transition-all duration-300
                            ${isDark ? 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-95' : 'bg-blue-400 text-gray-900 hover:bg-blue-500 hover:scale-95'}
                            shadow-lg hover:shadow-xl`}
                        title="Guardar"
                        data-tooltip-id='guardarLabel'
                        data-tooltip-content="Guardar"
                    >
                        {loading ? <ImSpinner9 className="animate-spin text-2xl" /> : <LuShieldPlus className="text-2xl" />}
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
    }, [isDark]);

    return (
        <div className={`fixed inset-0 flex flex-col w-screen items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity animate-fadeIn z-40`}>
            <div className={`p-6 rounded-lg shadow-lg w-3/5 min-w-[525px] max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl
                ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
                relative flex flex-col items-center max-h-screen overflow-auto`
            }>
                <h1 className="text-2xl font-bold text-center mb-4">
                    Acciones de rol
                </h1>
                <div className="flex flex-col gap-4 w-full">
                    {[
                        {placeholder: "Tus roles", name: "roles", disabled: true, type: "security"},
                        {placeholder: "Agregar roles", name: "roles", disabled: true, type: "choice"},
                        //{placeholder: "Tus roles", name: "roles", disabled: true, type: "security"}
                    ].map((field, index) => (
                        <Fragment key={index}>
                            <RolesField
                                field={field}
                                isDark={isDark}
                                userId={userInfo.id}
                                values={field.type === "security" ? userInfo.roles : roleNames}
                                isAdmin={isAdmin}
                                {...(field.type === "choice" ? { onAddEachRole: handleSelectRole } : {})}
                                {...(field.type === "security" ? { onDeleteEachRole: handleSelectRole } : {})}
                            />
                        </Fragment>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default RoleActionModal
