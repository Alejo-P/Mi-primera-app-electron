import React from 'react'

import { PROFILE_STATUS } from '@constants/profileStatus';

const ProfileActionCard = ({
    item,
    isDark,
}) => {
    return (
        <div
            className={`flex gap-2 justify-start items-center p-3 mt-3 rounded-lg z-10 border-2
                shadow-[0_6px_15px_rgba(0,0,0,0.7)] transition-all duration-300
                ${isDark ? 'bg-gray-800 text-white border-gray-300' : 'bg-white text-gray-900 border-gray-500'}
            `}
        >
            <p className={`text-sm flex flex-row items-center gap-2`}>
                <span
                    className={`inline-block w-2 h-2 rounded-full mr-3
                        ${(item.action === PROFILE_STATUS.ENABLED) ? 'bg-green-600' : 'bg-red-600'}
                    `}
                ></span>
                La cuenta se ha {item.action} el {new Date(item.created_at).toLocaleString()} con el motivo:
                <span className="font-semibold italic ml-1 uppercase">{item.reason}</span>
            </p>
        </div>
    )
}

export default ProfileActionCard
