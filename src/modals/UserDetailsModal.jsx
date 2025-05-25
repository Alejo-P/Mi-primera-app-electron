import React from 'react'

const UserDetailsModal = ({
    handleModal,
    user,
    isDark
}) => {
    return (
        <div className={`fixed inset-0 flex flex-col w-screen items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity animate-fadeIn z-40`}>
            <div className={`p-6 rounded-lg shadow-lg w-3/5 min-w-[525px] max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl
                ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
                relative flex flex-col items-center max-h-screen overflow-auto`
            }>

            </div>
        </div>
    )
}

export default UserDetailsModal
