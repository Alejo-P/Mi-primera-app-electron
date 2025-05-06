import { createContext, useContext, useState, useMemo, use } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

import { useApp } from './AppProvider';
import { useAuth } from './AuthProvider';
import { useAxios } from '../hooks/useAxios';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
    const { handleNotificacion } = useApp();
    const { user, setUser } = useAuth();
    const { request } = useAxios(); // ¡aquí la magia!
    const [usersList, setUsersList] = useState([]);
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
            const updatedUser = { ...user };
            if (!updatedUser.roles) {
                updatedUser.roles = [];
            }
            updatedUser.roles.push(role);
            setUser(updatedUser);
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

        return response;
    }

    const contextValue = useMemo(() => ({
        loading,
        usersList,
        setUsersList,
        getAllUsers,
        getUserById,
        enableUser,
        disableUser,
        setLoading,
        addRole,
        removeRole
    }), [usersList, loading]);
    
    return (
        <AdminContext.Provider value={contextValue}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => useContext(AdminContext);