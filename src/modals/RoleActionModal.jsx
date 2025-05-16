import React, { useState, useEffect } from 'react';
import { IoClose } from "react-icons/io5";
import { ImSpinner9 } from "react-icons/im";
import { LuShieldCheck } from "react-icons/lu";
import { useApp } from '@contexts/AppProvider';
import { useAdmin } from '@contexts/AdminProvider';
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
    const [loading, setLoading] = useState(false);

    const availableRoles = roleList
        .map(role => role.name)
        .filter(role => !roles.includes(role));

    // const toggleRoleSelection = (role) => {
    //     setSelectedRoles(prev =>
    //         prev.includes(role)
    //             ? prev.filter(r => r !== role)
    //             : [...prev, role]
    //     );

    //     setRoles(prev =>
    //         prev.includes(role)
    //             ? prev.filter(r => r !== role)
    //             : [...prev, role]
    //     );
    // };

    const hasChanges = () => {
        const added = roles.filter(role => !initialRoles.includes(role));
        const removed = initialRoles.filter(role => !roles.includes(role));
        return added.length > 0 || removed.length > 0;
    };

    const disabled = !hasChanges();

    const handleAddRole = (role) => {
        if (!roles.includes(role)) {
            setRoles(prev => [...prev, role]);
        }
    };

    const handleDeleteRole = (role) => {
        setRoles(prev => prev.filter(r => r !== role));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const addedRoles = roles.filter(r => !initialRoles.includes(r));
            const removedRoles = initialRoles.filter(r => !roles.includes(r));

            console.log("Roles a agregar:", addedRoles);
            console.log("Roles a eliminar:", removedRoles);

            // Puedes hacer llamadas paralelas o secuenciales según prefieras
            await Promise.all([
                ...addedRoles.map(role => addRole(role, userInfo.id)),
                ...removedRoles.map(role => removeRole(role, userInfo.id))
            ]);

            // Podrías cerrar el modal o mostrar un mensaje de éxito aquí
            handleClose();

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
        console.log("Roles actuales:", roles);
        console.log("Originales:", initialRoles);
        console.log("Cambios detectados:", hasChanges());
    }, [roles]);


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
                            : <LuShieldCheck className="text-2xl" />
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
