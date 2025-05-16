import React from 'react'
import { FaUserEdit, FaUserCheck } from "react-icons/fa";
import { IoPersonRemove } from "react-icons/io5";
import { Tooltip as ReactTooltip } from 'react-tooltip';

import UserAvatar from './UserAvatar';

const UserBarCard = ({
    userInfo,
    isUserLogged = false,
    isDark,
    loading,
    headerList,
    handleEditUser,
    handleEnableUser,
    handleDisableUser,
    handleAddRole,
    handleRemoveRole
}) => {
    return (
        <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 justify-evenly items-center pt-3 pb-3 mt-3 rounded-lg z-10
            shadow-[0_6px_15px_rgba(0,0,0,0.7)] transition-all duration-300 border hover:scale-98 hover:shadow-xl
            ${isDark ? 'bg-gray-800 text-white border-gray-600'
                : 'bg-white text-gray-900 border-gray-300'
            }
            ${userInfo.is_active ? '' : 'opacity-50 cursor-not-allowed'}
        `}>
            {
                headerList.map((element, index) => {
                    let content = null;
                    switch (element.key) {
                        case 'avatar':
                            content = (
                                <div className="flex items-center justify-center">
                                    <UserAvatar
                                        user={userInfo}
                                        isDark={isDark}
                                        isLoading={loading}
                                        size={45}
                                        placeTooltip="left"
                                    />
                                </div>
                            );
                        break;
                        case 'name':
                            content = <p className="text-sm font-semibold text-center">{userInfo.name}</p>;
                        break;
                        case 'roles':
                            content = <p className="text-sm font-semibold text-center">{userInfo.roles.join(', ')}</p>;
                        break;
                        case 'statistics':
                            content = (
                                <>
                                    <div className="flex flex-col gap-3 items-start justify-center">
                                        <p className={`text-sm font-semibold text-center`}>
                                            <span
                                                className={`inline-block w-2 h-2 rounded-full mr-3 ${userInfo.is_active ? 'bg-green-600' : 'bg-red-600'}`}
                                                data-tooltip-id="statusLabel"
                                                data-tooltip-content={userInfo.is_active ? 'Usuario activo' : 'Usuario inactivo'}
                                            ></span>
                                            {userInfo.is_active ? 'Activo' : 'Inactivo'}
                                        </p>

                                        <p className={`text-sm font-semibold text-center`}>
                                            <span
                                                className={`inline-block w-2 h-2 rounded-full mr-3 ${userInfo.is_verified ? 'bg-green-600' : 'bg-red-600'}`}
                                                data-tooltip-id="verifiedLabel"
                                                data-tooltip-content={userInfo.is_verified ? 'Usuario verificado' : 'Usuario no verificado'}
                                            ></span>
                                            {userInfo.is_verified ? 'Verificado' : 'No verificado'}
                                        </p>
                                    </div>
                                    <ReactTooltip
                                        id="statusLabel"
                                        place="top"
                                        effect="solid"
                                        className={`tooltip ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
                                    />
                                    <ReactTooltip
                                        id="verifiedLabel"
                                        place="top"
                                        effect="solid"
                                        className={`tooltip ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
                                    />
                                </>
                            );
                        break;
                        case 'actions':
                            content = (
                                <>
                                    <button
                                        onClick={() => handleEditUser(userInfo)}
                                        className={`text-2xl cursor-pointer ${isDark ? 'text-gray-300 hover:text-gray-400' : 'text-gray-700 hover:text-gray-800'}`}
                                        data-tooltip-id="editUserLabel"
                                        data-tooltip-content="Editar usuario"
                                    >
                                        <FaUserEdit className={`text-2xl`} />
                                    </button>
                                    <ReactTooltip
                                        id="editUserLabel"
                                        place="top"
                                        effect="solid"
                                        className={`tooltip ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
                                    />
                                    {
                                        (!isUserLogged && userInfo.is_active) && (
                                            <>
                                                <button
                                                    onClick={() => handleDisableUser(userInfo.id)}
                                                    className={`text-2xl cursor-pointer ${isDark ? 'text-gray-300 hover:text-gray-400' : 'text-gray-700 hover:text-gray-800'}`}
                                                    data-tooltip-id="deleteUserLabel"
                                                    data-tooltip-content="Eliminar usuario"
                                                >
                                                    <IoPersonRemove className={`text-2xl`} />
                                                </button>
                                                <ReactTooltip
                                                    id="deleteUserLabel"
                                                    place="top"
                                                    effect="solid"
                                                    className={`tooltip ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
                                                />
                                            </>
                                        )
                                    }
                                    {
                                        (!isUserLogged && !userInfo.is_active) && (
                                            <>
                                                <button
                                                    onClick={() => handleEnableUser(userInfo.id)}
                                                    className={`text-2xl ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                                                    data-tooltip-id="enableLabel"
                                                    data-tooltip-content="Activar usuario"
                                                >
                                                    <FaUserCheck className={`text-2xl`} />
                                                </button>
                                                <ReactTooltip
                                                    id="enableLabel"
                                                    place="top"
                                                    effect="solid"
                                                    className={`tooltip ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
                                                />
                                            </>
                                        )
                                    }
                                </>
                            );
                        break;
                        default:
                            content = null;
                        break;
                    }
                    return (
                        <div
                            key={element.key}
                            className={`${index < (headerList.length - 1) ? 'border-r-2 border-dashed w-full flex justify-center' : ''}
                                items-center justify-center w-full h-full
                                ${element.key === 'avatar' ? 'flex' : ''}
                                ${element.key === 'name' ? 'hidden sm:flex' : ''}
                                ${element.key === 'roles' ? 'hidden lg:flex' : ''}
                                ${element.key === 'statistics' ? 'hidden md:flex' : ''}
                                ${element.key === 'actions' ? 'flex' : ''}
                            `}
                        >
                            <div className={`flex flex-row items-center w-full h-full justify-around
                                ${element.key === 'avatar' ? 'flex' : ''}`}>
                                {content}
                            </div>
                        </div>
                    );
                })
            }
        </div>
    )
}

export default UserBarCard
