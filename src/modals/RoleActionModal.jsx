import React, { useState, useEffect, useRef } from 'react';
import { IoClose } from "react-icons/io5";
import { ImSpinner9 } from "react-icons/im";
import { LuShieldPlus } from "react-icons/lu";

import { THEMES } from '@constants/temas';
import { useApp } from '@contexts/AppProvider';
import { useAdmin } from '@contexts/AdminProvider';

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
    const { addRole, removeRole } = useAdmin();
    const initialRoles = userInfo.roles || [];
    const [roles, setRoles] = useState([...userInfo.roles]);
    const [addRoleList, setAddRoleList] = useState([]);
    const [removeRoleList, setRemoveRoleList] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [loading, setLoading] = useState(false);

    const availableRoles = roleList
        .map(role => role.name)
        .filter(role => !roles.includes(role));

    const disabled = selectedRoles.length === 0;

    const toggleRoleSelection = (role) => {
        setSelectedRoles(prev =>
            prev.includes(role)
                ? prev.filter(r => r !== role)
                : [...prev, role]
        );

        setRoles(prev =>
            prev.includes(role)
                ? prev.filter(r => r !== role)
                : [...prev, role]
        );
    };

    const handleAddRole = (role) => {
        // Solo agregar si el usuario NO lo tiene ya
        if (!userInfo.roles.includes(role)) {
            setAddRoleList(prev => [...prev, role]);
            setRoles(prev => [...prev, role]);
        }
        setRemoveRoleList(prev => prev.filter(r => r !== role));
    };

    const handleDeleteRole = (role) => {
        // Solo considerar la eliminación si el usuario originalmente tenía el rol
        if (userInfo.roles.includes(role)) {
            setRemoveRoleList(prev => [...prev, role]);
        }
        setAddRoleList(prev => prev.filter(r => r !== role));
        setRoles(prev => prev.filter(r => r !== role));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            console.log("Enviar cambios de rol:", selectedRoles);
            // Aquí podrías llamar a addRole/removeRole dependiendo del caso.
        } catch (err) {
            console.error("Error al enviar cambios de rol:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setTimeout(() => handleModal(''), 200);
    };

    useEffect(() => {
        setNavActionsItems([
            {
                key: 'guardar',
                element: (
                    <button
                        type='submit'
                        form='rolesForm'
                        className={`p-2 rounded-lg transition-all duration-300
                            ${(disabled || loading) ? 'cursor-not-allowed bg-gray-300 text-gray-500'
                                : isDark ? 'bg-blue-600 text-white'
                                : 'bg-blue-400 text-gray-900 hover:bg-gray-400'}
                            hover:scale-95 shadow-lg hover:shadow-xl`}
                        title="Guardar"
                        data-tooltip-id='guardarLabel'
                        data-tooltip-content={`${disabled ? 'Selecciona un rol primero' : 'Guardar cambios'}`}
                        disabled={disabled || loading}
                    >
                        {loading
                            ? <ImSpinner9 className="animate-spin text-2xl" />
                            : <LuShieldPlus className="text-2xl" />
                        }
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
        ]);
    }, [isDark, disabled, loading]);

    return (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center w-screen p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div className={`p-6 w-3/5 min-w-[525px] max-w-screen-xl rounded-lg shadow-lg
                ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
                relative flex flex-col items-center max-h-screen overflow-auto`}>
                <h1 className="mb-4 text-2xl font-bold text-center">
                    Acciones de rol
                </h1>
                <form id="rolesForm" className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
                    <RolesField
                        field={{ placeholder: "Tus roles", name: "roles", disabled: true, type: "security" }}
                        isDark={isDark}
                        userId={userInfo.id}
                        values={roles}
                        isAdmin={isAdmin}
                        onDeleteEachRole={handleDeleteRole}
                    />
                    <RolesField
                        field={{ placeholder: "Agregar roles", name: "roles", disabled: true, type: "choice" }}
                        isDark={isDark}
                        userId={userInfo.id}
                        values={availableRoles}
                        isAdmin={isAdmin}
                        onAddEachRole={handleAddRole}
                    />
                </form>
            </div>
        </div>
    );
};

export default RoleActionModal;
