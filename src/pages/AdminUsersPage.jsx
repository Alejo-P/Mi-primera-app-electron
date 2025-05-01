import React from 'react'

// Importamos el contexto
import { useApp } from '../contexts/AppProvider'
import { useAuth } from '../contexts/AuthProvider'

// Importamos las constantes
import { THEMES } from '../constants/temas'
import { ROLES } from '../constants/roles'


const AdminUsersPage = () => {
    const { tema } = useApp()
    const { user } = useAuth()
    const isDark = tema === THEMES.DARK
    const isAdmin = user && user.roles.some(role => role === ROLES.ADMIN) ? true : false

    return (
        <div className={`overflow-x-auto shadow-lg p-3 sm:rounded-lg w-full
            ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} transition-all duration-300
        `}>
            <h2 className="text-2xl text-center font-bold">
                Administrar usuarios
            </h2>
        
        </div>
    )
}

export default AdminUsersPage
