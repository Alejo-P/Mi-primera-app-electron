import React, { useEffect, useState, Fragment } from 'react'
import { useNavigate } from 'react-router-dom'; 
import { HiOutlineRefresh } from 'react-icons/hi';
import { IoPersonAdd } from "react-icons/io5";
import { Tooltip as ReactTooltip } from 'react-tooltip';

// Importamos el contexto
import { useApp } from '@contexts/AppProvider'
import { useAuth } from '@contexts/AuthProvider'
import { useAdmin } from '@contexts/AdminProvider'

// Importamos los componentes
import LoadingCard from '@components/LoadingCard'
import UserBarCard from '@components/UserBarCard';
import CreateUserModal from '@modals/CreateUserModal';

// Importamos las constantes
import { THEMES } from '@constants/temas'
import { ROLES } from '@constants/roles'

const AdminUsersPage = () => {
    const { tema, setNavActionsItems, setVisibleNav } = useApp();
    const { user } = useAuth();
    const { getAllUsers, enableUser, disableUser, usersList, addRole, removeRole, loading } = useAdmin();
    const [ headerList ] = useState([
        { title: 'Avatar', key: 'avatar' },
        { title: 'Nombre', key: 'name' },
        { title: 'Roles', key: 'roles' },
        { title: 'Estado', key: 'statistics' },
        { title: 'Acciones', key: 'actions' }
    ]);
    const [showCreateUserModal, setShowCreateUserModal] = useState(false);
    const navigate = useNavigate();
    const isDark = tema === THEMES.DARK

    const handleRefresh = async () => {
        setVisibleNav(false);
        await handleFetchUsers();
        setVisibleNav(true);
    }

    const handleFetchUsers = async () => {
        await getAllUsers();
    }

    const handleEditUser = async (userInfo) => {
        navigate(`/dashboard/profile/${userInfo?.id}`);
    }

    const handleDeleteRole = async (role, userId) => {
        console.log(role, userId);
        if (user?.roles?.includes(ROLES.ADMIN) && user?.roles?.length > 1) {
            await removeRole(role, userId);
        } else {
            handleNotificacion('error', 'No puedes eliminar el rol', 5000);
        }
    };

    const handleAddRole = async (role, userId) => {
        if (user?.roles?.includes(ROLES.ADMIN)) {
            await addRole(role, userId);
        }
    }

    const handleCreateModal = async () => {
        if (user?.roles?.includes(ROLES.ADMIN)) {
            setShowCreateUserModal(!showCreateUserModal);
        }
    }

    const handleEnableUser = async (userId) => {
        const confirm = window.confirm(`¿Activar usuario ${userId}?`);
        if (user?.roles?.includes(ROLES.ADMIN) && confirm) {
            await enableUser(userId);
        }
    }

    const handleDisableUser = async (userId) => {
        const confirm = window.confirm(`¿Eliminar usuario ${userId}?`);
        if (user?.roles?.includes(ROLES.ADMIN) && confirm) {
            await disableUser(userId);
        }
    }

    useEffect(() => {
        const acciones = [
            {
                key: 'Crear usuario',
                element: (
                    <button
                        onClick={() => handleCreateModal()}
                        className={`p-2 rounded-lg transition-all duration-300
                            ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-300 text-gray-900 hover:bg-gray-400'} 
                            hover:scale-95 shadow-lg hover:shadow-xl`}
                        title="Crear usuario"
                        data-tooltip-id="addUserLabel"
                        data-tooltip-content="Crear nuevo usuario"
                    >
                        <span className="text-3xl">
                            <IoPersonAdd className='text-2xl'/>
                        </span>
                    </button>
                )
            },
            {
                key: 'refrescar',
                element: (
                    <button
                        onClick={handleRefresh}
                        className={`p-2 rounded-lg transition-all duration-300
                            ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-300 text-gray-900 hover:bg-gray-400'} 
                            hover:scale-95 shadow-lg hover:shadow-xl`}
                        title="Actualizar lista"
                        data-tooltip-id="refreshLabel"
                        data-tooltip-content="Actualizar la lista de usuarios"
                    >
                        <span className="text-3xl">
                            <HiOutlineRefresh className='text-2xl'/>
                        </span>
                    </button>
                )
            }
        ];
        if (!showCreateUserModal) {
            setNavActionsItems(acciones);
        }
    }, [isDark, showCreateUserModal]);

    useEffect(() => {
        if (!usersList.length) {
            handleFetchUsers();
        }
    }, []);

    return (
        <>
            <h2 className="text-2xl text-center font-bold">
                Administrar usuarios
            </h2>
            {loading ? (
                <LoadingCard />
            ) : usersList.length > 0 ? (
                <>
                    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 justify-evenly items-center pt-3 pb-3 mt-3 rounded-lg z-40
                        shadow-[0_6px_15px_rgba(0,0,0,0.7)] transition-all duration-300 border sticky top-0
                        ${isDark ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}
                    `}>
                        {
                            headerList.map((element, index) => (
                                <div
                                    key={element.key}
                                    className={`flex flex-row items-center w-full h-full justify-around uppercase
                                        ${index < (headerList.length - 1) ? 'border-r-2' : ''}
                                        ${element.key === 'name' ? 'hidden sm:block' : ''}
                                        ${element.key === 'roles' ? 'hidden lg:block' : ''}
                                        ${element.key === 'statistics' ? 'hidden md:block' : ''}
                                        ${isDark ? 'text-gray-300' : 'text-gray-700'}
                                    `}
                                >
                                    <p className={`text-sm font-semibold text-center`}>
                                        {element.title}
                                    </p>
                                </div>
                            ))
                        }
                    </div>
                    {
                        usersList.map((userInfo) => (
                            <UserBarCard
                                key={userInfo.id}
                                userInfo={userInfo}
                                isDark={isDark}
                                isUserLogged={user?.id === userInfo.id}
                                loading={loading}
                                headerList={headerList}
                                handleEditUser={handleEditUser}
                                handleAddRole={handleAddRole}
                                handleDeleteRole={handleDeleteRole}
                                handleEnableUser={handleEnableUser}
                                handleDisableUser={handleDisableUser}
                            />  
                        ))
                    }
                </>
            ) : (
                <div className="flex items-center justify-center text-gray-400">
                    <p className="text-center font-bold italic">
                        No hay usuarios registrados
                    </p>
                </div>
            )}
            {
                showCreateUserModal && (
                    <CreateUserModal
                        isDark={isDark}
                        handleModal={handleCreateModal}
                    />
                )
            }
        </>
    )
}

export default AdminUsersPage
