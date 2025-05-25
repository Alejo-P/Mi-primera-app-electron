import React from 'react'
import Avatar from "react-avatar";
import { FaPen } from "react-icons/fa";
import { Tooltip as ReactTooltip } from 'react-tooltip';

const UserAvatar = ({
    user,
    isDark,
    onClick,
    isLoading = false,
    round = true,
    size = 50,
    maxInitials = 2,
    placeTooltip = 'top',
}) => {
    const handleAvatarModal = () => {
        if (isLoading) return;
        onClick && onClick(user);
    }
    return (
        <div
            className={`
                rounded-full border-2 flex items-center justify-center relative group
                ${isDark ? 'bg-gray-800' : 'bg-gray-100'}
                ${isLoading ? 'animate-pulse cursor-not-allowed' : ''}
                ${onClick ? 'hover:bg-gray-200 hover:scale-110 cursor-pointer' : ''}
                transition-transform duration-300 ease-in-out
                ${isDark 
                    ? 'border-gray-600 shadow-md shadow-black/40' 
                    : 'border-gray-300 shadow-md shadow-gray-400/50'
                }
                ring-1 ring-offset-1 ${isDark ? 'ring-white/20' : 'ring-black/10'}
            `}
            data-tooltip-id={`profile ${user?.id}`}
            data-tooltip-content={`${isLoading ? 'Cargando...' : `Perfil de ${user?.name || "N/A"}`}`}
            onClick={handleAvatarModal}
        >
            <Avatar
                src={user?.avatar?.url || ''}
                name={user?.name || "N/A"}
                round={round}
                alt={`Perfil de ${user?.name || "N/A"}`}
                title={`Perfil de ${user?.name || "N/A"}`}
                size={size}
                maxInitials={maxInitials}
                color={isDark ? '#2D3748' : '#F7FAFC'}
                fgColor={isDark ? '#fff' : '#2D3748'}
                className="font-bold text-lg transition-all duration-300"
                style={{ padding: 0 }}
            />
            {/* Icono de editar */}
            {
                onClick ? (
                    <div className={`
                        absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 flex items-center justify-center
                        ${isDark 
                            ? 'bg-gray-700 border-gray-500 shadow-md shadow-black/30 text-white' 
                            : 'bg-white border-gray-300 shadow-md shadow-gray-400/30 text-gray-700'
                        }
                        transition-all duration-300 ease-in-out
                        ring-1 ring-offset-1 ${isDark ? 'ring-white/20' : 'ring-black/10'}
                        ${isLoading ? 'animate-pulse cursor-not-allowed' : ''}
                    `}>
                        <FaPen className={`
                            text-[10px]
                            transition-transform duration-300 ease-in-out
                            group-hover:rotate-15
                        `}/>
                    </div>
                ) : (
                    <div className={`
                        absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 flex items-center justify-center
                        ${isDark 
                            ? 'bg-gray-700 border-gray-500 shadow-md shadow-black/30 text-white' 
                            : 'bg-white border-gray-300 shadow-md shadow-gray-400/30 text-gray-700'
                        }
                        transition-all duration-300 ease-in-out
                        ring-1 ring-offset-1 ${isDark ? 'ring-white/20' : 'ring-black/10'}
                        ${isLoading ? 'animate-pulse cursor-not-allowed' : ''}
                    `}>
                        <div className={`
                            w-2 h-2 rounded-full
                            ${user?.is_connected ? 'bg-green-500' : 'bg-gray-500'}
                        `}/>
                    </div>
                )
            }
            <ReactTooltip id={`profile ${user?.id}`} place={placeTooltip} effect="solid" />
        </div>
    )
}

export default UserAvatar
