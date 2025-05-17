import { createContext, useContext, useState, useMemo, use } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

import { useApp } from './AppProvider';
import { useAuth } from './AuthProvider';
import { useAxios } from '@hooks/useAxios';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
    const { handleNotificacion } = useApp();
    const { user, setUser } = useAuth();
    const { request } = useAxios(); // ¡aquí la magia!
    const [usersList, setUsersList] = useState([]);
    const [rolesList, setRolesList] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const getAllUsers = async () => {
        setLoading(true);
        const response = await request({
            method: 'get',
            url: '/users',
            notify: {
                success: true,
                error: true
            }
        });

        if (response) {
            setUsersList(response);
        }
        setLoading(false);
    }

    const getUserById = async (userId) => {
        setLoading(true);
        const response = await request({
            method: 'get',
            url: `/user/${userId}`,
            notify: {
                success: true,
                error: true
            }
        });

        setLoading(false);
        return response;
    }

    const enableUser = async (userId) => {
        setLoading(true);
        const response = await request({
            method: 'post',
            url: `/user/activate/${userId}`,
            notify: {
                success: true,
                error: true
            }
        });
    
        if (response) {
            setUsersList((prev) => prev.map((user) => {
                if (user.id === userId){
                    return { ...user, is_active: true };
                }
                return user;
            }));
            handleNotificacion('success', response.msg, 5000);
        }
        setLoading(false);  
    }

    const disableUser = async (userId) => {
        setLoading(true);
        const response = await request({
            method: 'post',
            url: `/user/deactivate/${userId}`,
            notify: {
                success: true,
                error: true
            }
        });

        if (response) {
            setUsersList((prev) => prev.map((user) => {
                if (user.id === userId){
                    return { ...user, is_active: false };
                }
                return user;
            }));
            handleNotificacion('success', response.msg, 5000);
        }
        setLoading(false);  
    }

    const updateUser = async (userId, data) => {
        setLoading(true);
        const response = await request({
            method: 'put',
            url: `/user/${userId}`,
            payload: data,
            notify: {
                success: true,
                error: true
            }
        });
        if (response) {
            setUsersList((prev) => prev.map((user) => {
                if (user.id === userId){
                    return { ...user, ...data };
                }
                return user;
            }));
            handleNotificacion('success', response.msg, 5000);
        }

        setLoading(false);
        return response;
    }

    const updateUserPassword = async (userId, data) => {
        setLoading(true);
        const response = await request({
            method: 'put',
            url: `/user/change-password/${userId}`,
            payload: data,
            notify: {
                success: true,
                error: true
            }
        });
        if (response) {
            handleNotificacion('success', response.msg, 5000);
        }

        setLoading(false);
        return response;
    }

    const addRole = async (role, user_id) => {
        const response = await request({
            method: 'post',
            url: '/add_role',
            payload: {
                role_name: role,
                user_id: user_id
            },
            notify: {
                success: false,
                error: true
            }
        });

        if (response) {
            handleNotificacion('success', 'Rol añadido correctamente', 5000);

            // Actualizar el estado del usuario en el contexto (solo si el usuario autenticado es el mismo) 
            if (user.id === user_id) {
                const updatedUser = { ...user };
                if (!updatedUser.roles) {
                    updatedUser.roles = [];
                }
                updatedUser.roles.push(role);
                setUser(updatedUser);
            }
        }
    }

    const removeRole = async (role, user_id) => {
        const response = await request({
            method: 'delete',
            url: '/remove_role',
            payload: {
                role_name: role,
                user_id: user_id
            },
            notify: {
                success: false,
                error: true
            }
        });

        if (response) {
            handleNotificacion('success', 'Rol eliminado correctamente', 5000);

            // Actualizar el estado del usuario en el contexto (solo si el usuario autenticado es el mismo) 
            if (user.id === user_id) {
                const updatedUser = { ...user };
                if (updatedUser.roles) {
                    updatedUser.roles = updatedUser.roles.filter(r => r !== role);
                }
                setUser(updatedUser);
            }
        }
    }

    const getRolesList = async () => {
        const response = await request({
            method: 'get',
            url: '/roles',
            notify: {
                success: true,
                error: true
            }
        });

        if (response) {
            setRolesList(response);
        }
    }

    const sendVerfyEmail = (userId) => {
        setLoading(true);
        const response = request({
            method: 'post',
            url: `/send-verification-email/${userId}`,
            notify: {
                success: true,
                error: true
            }
        });

        if (response) {
            handleNotificacion('success', response.msg, 5000);
        }
        setLoading(false);
    }

    const contextValue = useMemo(() => ({
        loading,
        usersList,
        rolesList,
        setRolesList,
        setUsersList,
        getAllUsers,
        getUserById,
        enableUser,
        disableUser,
        sendVerfyEmail,
        updateUser,
        updateUserPassword,
        setLoading,
        addRole,
        removeRole,
        getRolesList
    }), [usersList, loading, rolesList]);
    
    return (
        <AdminContext.Provider value={contextValue}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => useContext(AdminContext);