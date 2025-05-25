import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'; 
import { FaUserEdit, FaUserCheck, FaUserMinus } from 'react-icons/fa';
import { HiOutlineRefresh } from 'react-icons/hi';
import { IoPersonAdd } from "react-icons/io5";
import { Tooltip as ReactTooltip } from 'react-tooltip';

// Importamos el contexto
import { useApp } from '@contexts/AppProvider'
import { useAuth } from '@contexts/AuthProvider'
import { useAdmin } from '@contexts/AdminProvider'

// Importamos los componentes
import LoadingCard from '@components/LoadingCard'
import UserBarCard from '@components/UserBarCard'
import CreateUserModal from '@modals/CreateUserModal'
import ActionProfileModal from '@modals/ActionProfileModal'

// Importamos las constantes
import { THEMES } from '@constants/temas'
import { ROLES } from '@constants/roles'

const AdminUsersPage = () => {
    const { tema, setNavActionsItems, setVisibleNav } = useApp();
    const { user } = useAuth();
    const { getAllUsers, usersList, loading } = useAdmin();
    const [ headerList ] = useState([
        { title: 'Avatar', key: 'avatar' },
        { title: 'Nombre', key: 'name' },
        { title: 'Roles', key: 'roles' },
        { title: 'Correo', key: 'email' },
        { title: 'Estado', key: 'statistics' }
    ]);
    const [showCreateUserModal, setShowCreateUserModal] = useState(false);
    const [showActionModal, setShowActionModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const navigate = useNavigate();
    const isDark = tema === THEMES.DARK

    const handleRefresh = async () => {
        setVisibleNav(false);
        await handleFetchUsers();
        setVisibleNav(true);
    }

    const handleFetchUsers = async () => {
        setSelectedUser(null);
        setShowCreateUserModal(false);
        await getAllUsers();
    }

    const handleEditUser = async (userInfo) => {
        navigate(`/dashboard/profile/${userInfo?.id}`);
    }

    const handleCreateModal = async () => {
        if (user?.roles?.includes(ROLES.ADMIN)) {
            setShowCreateUserModal(!showCreateUserModal);
        }
    }

    const handleActionModal = async () => {
        if (!selectedUser) return;
        setShowActionModal(!showActionModal);
    }

    const handleSelectedUser = (userInfo) => {
        // Si el usuario seleccionado es el mismo que esta seleccionado, lo deselecciona
        if (selectedUser?.id === userInfo.id) {
            setSelectedUser(null);
            return;
        }
        setSelectedUser(userInfo);
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

        if (selectedUser) {
            const userActions = [
                {
                    key: 'Editar',
                    element: (
                        <button
                            onClick={() => handleEditUser(selectedUser)}
                            className={`p-2 rounded-lg transition-all duration-300
                                ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-300 text-gray-900 hover:bg-gray-400'} 
                                hover:scale-95 shadow-lg hover:shadow-xl`}
                            title={`Editar usuario ${selectedUser.name}`}
                            data-tooltip-id="editUserLabel"
                            data-tooltip-content={`Editar usuario ${selectedUser.name}`}
                        >
                            <span className="text-3xl">
                                <FaUserEdit className='text-2xl'/>
                            </span>
                        </button>
                    )
                }
            ];
            // Solo muestra los botones de activar/desactivar si el usuario no es el mismo que el que está logueado
            // y si el usuario tiene el rol de admin
            if (user?.id !== selectedUser.id) {
                if (selectedUser?.is_active) {
                    userActions.push({
                        key: 'Desactivar',
                        element: (
                            <button
                                onClick={handleActionModal}
                                className={`p-2 rounded-lg transition-all duration-300
                                    ${isDark ? 'bg-red-600 text-white' : 'bg-red-400 text-gray-900 hover:bg-red-500'} 
                                    hover:scale-95 shadow-lg hover:shadow-xl`}
                                title={`Desactivar usuario ${selectedUser.name}`}
                                data-tooltip-id="disableUserLabel"
                                data-tooltip-content={`Desactivar usuario ${selectedUser.name}`}
                            >
                                <span className="text-3xl">
                                    <FaUserMinus className='text-2xl'/>
                                </span>
                            </button>
                        )
                    });
                } else {
                    userActions.push({
                        key: 'Activar',
                        element: (
                            <button
                                onClick={handleActionModal}
                                className={`p-2 rounded-lg transition-all duration-300
                                    ${isDark ? 'bg-green-600 text-white' : 'bg-green-400 text-gray-900 hover:bg-green-500'} 
                                    hover:scale-95 shadow-lg hover:shadow-xl`}
                                title={`Activar usuario ${selectedUser.name}`}
                                data-tooltip-id="enableUserLabel"
                                data-tooltip-content={`Activar usuario ${selectedUser.name}`}
                            >
                                <span className="text-3xl">
                                    <FaUserCheck className='text-2xl'/>
                                </span>
                            </button>
                        )
                    });
                }
            }
            // Solo muestra los botones antes del boton recargar
            const refreshIndex = acciones.findIndex((accion) => accion.key === 'refrescar');
            acciones.splice(refreshIndex, 0, ...userActions);

            // Eliminar el primer elemento (crear usuario) de las acciones cuando se seleccione un usuario
            acciones.shift()
        }

        if (!showCreateUserModal && !showActionModal) {
            setNavActionsItems(acciones);
        }
    }, [isDark, showCreateUserModal, showActionModal, selectedUser]);

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
                                        ${element.key === 'email' ? 'hidden md:block' : ''}
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
                                loading={loading}
                                isSelected={selectedUser?.id === userInfo.id}
                                headerList={headerList}
                                handleClick={handleSelectedUser}
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
            {
                showActionModal && (
                    <ActionProfileModal
                        isDark={isDark}
                        handleModal={handleActionModal}
                        setUserInfo={setSelectedUser}
                        userInfo={selectedUser}
                        actionType={selectedUser?.is_active ? 'disable' : 'enable'}
                    />
                )
            }
            {
                <ReactTooltip
                    id="addUserLabel"
                    place="top"
                    effect="solid"
                    className={`tooltip ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
                />
            }
            {
                <ReactTooltip
                    id="refreshLabel"
                    place="top"
                    effect="solid"
                    className={`tooltip ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
                />
            }
            {
                <ReactTooltip
                    id="editUserLabel"
                    place="top"
                    effect="solid"
                    className={`tooltip ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
                />
            }
            {
                <ReactTooltip
                    id="enableUserLabel"
                    place="top"
                    effect="solid"
                    className={`tooltip ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
                />
            }
            {
                <ReactTooltip
                    id="disableUserLabel"
                    place="top"
                    effect="solid"
                    className={`tooltip ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
                />
            }
        </>
    )
}

export default AdminUsersPage
