import React, { useState } from 'react'
import { FaUserEdit, FaUserCheck } from "react-icons/fa";
import { IoPersonRemove } from "react-icons/io5";
import { Tooltip as ReactTooltip } from 'react-tooltip';

import UserAvatar from './UserAvatar';

const UserBarCard = ({
    userInfo,
    isDark,
    loading,
    isSelected,
    headerList,
    handleClick
}) => {
    const handleUserClick = () => {
        handleClick(userInfo);
    };

    return (
        <div
            className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 justify-evenly items-center pt-3 pb-3 mt-3 rounded-lg z-10
                shadow-[0_6px_15px_rgba(0,0,0,0.7)] transition-all duration-300
                ${isDark ? 'bg-gray-800 text-white'
                    : 'bg-white text-gray-900 border-gray-300'
                }
                ${isSelected ? 'shadow-[0_0_15px_rgba(0,0,0,0.7)] ring-3 scale-101'
                    : 'border-2 hover:scale-99 hover:shadow-[0_0_15px_rgba(0,0,0,0.3)] cursor-pointer hover:ring-2 hover:ring-offset-2 hover:animate-spin-slow'
                }
                ${
                    !userInfo.is_active ? 'border-red-700 ring-red-500'
                    : !userInfo.is_verified ? 'border-yellow-700 ring-yellow-500'
                    : 'border-blue-700 ring-blue-500'
                }
            `}
            onClick={handleUserClick}
            data-tooltip-id="userLabel"
            data-tooltip-content={userInfo.is_active ? 'Usuario activo' : 'Usuario inactivo'}
        >
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
                        case 'email':
                            content = <p className="text-sm ml-2 mr-2 font-semibold text-center overflow-hidden whitespace-nowrap overflow-ellipsis">{userInfo.email}</p>;
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
                                ${element.key === 'email' ? 'hidden md:flex' : ''}
                                ${element.key === 'statistics' ? 'flex' : ''}
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
