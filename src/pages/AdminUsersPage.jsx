import React, { useEffect, useState } from 'react'

// Importamos el contexto
import { useApp } from '../contexts/AppProvider'
import { useAuth } from '../contexts/AuthProvider'
import { useAdmin } from '../contexts/AdminProvider'

// Importamos los componentes
import LoadingCard from '../components/LoadingCard'
import CustomInput from '../components/CustomInput';
import RolesField from '../components/RolesField';
import UserAvatar from '../components/UserAvatar';

// Importamos las constantes
import { THEMES } from '../constants/temas'
import { ROLES } from '../constants/roles'

const AdminUsersPage = () => {
    const { tema, setNavActionsItems } = useApp();
    const { user } = useAuth();
    const { getAllUsers, usersList, addRole, removeRole, loading } = useAdmin();
    const isDark = tema === THEMES.DARK
    const isAdmin = user && user.roles.some(role => role === ROLES.ADMIN) ? true : false

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

    const handleAddRole = async (role, userId) => {
        if (user?.roles?.includes("Administrador") && user?.roles?.length > 1) {
            setIsLoading(true);
            await addRole(role, userId);
            setIsLoading(false);
        } else {
            handleNotificacion('error', 'No puedes añadir tu rol de Administrador', 5000);
        }
    }

    useEffect(() => {
        setNavActionsItems([]);
        const fetchUsers = async () => {
            await getAllUsers();
        };
        if (!usersList.length) {
            fetchUsers();
        }
        return () => {
            setNavActionsItems([]);
        };
    }, []);

    return (
        <>
            <h2 className="text-2xl text-center font-bold">
                Administrar usuarios
            </h2>
            {loading ? (
                <LoadingCard />
            ) : usersList.length > 0 ? (
                usersList.map((user) => (
                    <form key={user.id} className={`flex flex-row justify-evenly items-center gap-3 p-2 mt-3 rounded-lg z-100
                        shadow-[0_6px_15px_rgba(0,0,0,0.7)] transition-all duration-300 border
                        ${isDark ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}
                    `}>
                        <UserAvatar
                            user={user}
                            isDark={isDark}
                            isLoading={loading}
                            size={45}
                        />
                        <p className="text-sm font-semibold">{user.name}</p>
                        <RolesField
                            user={user}
                            isDark={isDark}
                            handleAddRole={handleAddRole}
                            handleDeleteRole={handleDeleteRole}
                            field={{placeholder: 'Roles', name: "roles", type: "security" }}
                        />
                        <CustomInput
                            Itype="text"
                            Iname="email"
                            Iplaceholder="Email"
                            Ivalue={user.email}
                            IisDark={isDark}
                            Idisabled={true}
                            Irequired={true}
                        />
                    </form>
                ))
            ) : (
                <div className="flex items-center justify-center text-gray-400">
                    <p className="text-center font-bold italic">
                        No hay usuarios registrados
                    </p>
                </div>
            )}
            {/* <div className={`flex flex-col gap-3 p-3 rounded-lg z-100
                shadow-[0_6px_15px_rgba(0,0,0,0.7)] transition-all duration-300 border
                ${isDark ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}
            `}>
            </div> */}
        </>
    )
}

export default AdminUsersPage
