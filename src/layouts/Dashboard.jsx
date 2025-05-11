import React, { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { HiHome } from "react-icons/hi";
import { FaQrcode } from 'react-icons/fa6';
import { FaRegFileAlt, FaUser, FaBars, FaUsersCog } from "react-icons/fa";

// Importamos las constantes
import { THEMES } from '@constants/temas';
import { ROLES } from '@constants/roles';

// Importamos los contextos
import { useAuth } from '@contexts/AuthProvider';
import { useApp } from '@contexts/AppProvider';
import { useFiles } from '@contexts/FilesProvider';
import { useQR } from '@contexts/QRProvider';
import { useAdmin } from '@contexts/AdminProvider';

// Importamos los componentes
import HeaderNav from '@components/HeaderNav'
import Notification from '@components/Notification'
import NavButton from '@components/NavButton';
import NavActions from '@components/NavActions';
import TitleBar from '@components/TitleBar';
import NavButtonSqueleton from '@components/NavButtonSqueleton';

const Dashboard = () => {
    const { profile, user, loading } = useAuth();
    const { notificacion, tema, setCurrentPath } = useApp();
    const { setFileList } = useFiles();
    const { setQRList } = useQR();
    const { setUsersList } = useAdmin();
    const { pathname } = useLocation();
    const isDark = tema === THEMES.DARK;

    const filterButtons = (userRoles, buttonRoles) => {
        return buttonRoles.some(rol => userRoles.includes(rol));
    };

    const buttons = [
        { path: "/dashboard/", icon: <HiHome className="text-3xl" />, tooltip: "Inicio", accessBy: [ROLES.USER, ROLES.ADMIN], active: pathname === '/dashboard/' },
        { path: "/dashboard/qr", icon: <FaQrcode className="text-3xl" />, tooltip: "QRs generados", accessBy: [ROLES.USER, ROLES.ADMIN], active: pathname === '/dashboard/qr' },
        { path: "/dashboard/files", icon: <FaRegFileAlt className="text-3xl" />, tooltip: "Archivos cargados", accessBy: [ROLES.USER, ROLES.ADMIN], active: pathname === '/dashboard/files' },
        { path: `/dashboard/profile/${user?.id}`, icon: <FaUser className="text-3xl" />, tooltip: "Perfil de usuario", accessBy: [ROLES.USER, ROLES.ADMIN], active: pathname.includes('/dashboard/profile') },
        { path: "/dashboard/admin/users", icon: <FaUsersCog className="text-3xl" />, tooltip: "Administrar usuarios", accessBy: [ROLES.ADMIN], active: pathname === '/dashboard/admin/users' },
    ];

    // Filtrar botones según los roles del usuario
    const userRoles = user?.roles ?? [];
    const filteredItems = buttons.filter(item => filterButtons(userRoles, item.accessBy));

    // Agrupar los botones por rol (USER y ADMIN), manteniendo el orden
    const groupedItems = {
        [ROLES.USER]: [],
        [ROLES.ADMIN]: []
    };

    filteredItems.forEach(item => {
        // Si el botón es accesible por admin, lo mandamos ahí. Si no, va a user
        if (item.accessBy.includes(ROLES.USER)) {
            groupedItems[ROLES.USER].push(item);
        } else {
            groupedItems[ROLES.ADMIN].push(item);
        }
    });

    useEffect(() => {
        setCurrentPath(pathname);
    }, [pathname]); // Se ejecuta cuando cambia la ruta

    //Cargar el perfil del usuario
    useEffect(() => {
        async function loadProfile() {
            await profile();
        }
        
        if (Object.keys(user).length !== 0) loadProfile();
        // Limpiar los datos de los contextos al desmontar el componente
        return () => {
            setFileList([]);
            setQRList([]);
            setUsersList([]);
        };
    }, []);

    return (
        <div className={`grid grid-cols-[20%_80%] grid-rows-[40px_50px_1fr] h-screen transition-all duration-300 min-w-[525px] scrollbar-track-transparent
            ${isDark ? 'bg-gray-900 text-white scrollbar-thumb-gray-300'
                : 'bg-slate-200 text-gray-900 scrollbar-thumb-gray-700'
            }
        `}
        >
            {/* 🟢 Barra de título personalizada */}
            <div className={`w-full col-span-full h-10 bg-opacity-90 z-60
                ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900 shadow-md'} transition-all duration-300
            `}>
                <TitleBar />
            </div>

            {/* 🔵 Header Nav */}
            <div className="w-full col-span-full h-12 flex items-center justify-evenly">
                <HeaderNav
                    text={
                        pathname === '/dashboard/' ? "Cargar un archivo" : 
                        pathname === '/dashboard/files' ? "Lista de archivos" :
                        pathname === '/dashboard/qr' ? "Lista de códigos QR" :
                        pathname.includes('/dashboard/profile') ? "Perfil de usuario" : 
                        pathname === '/dashboard/admin/users' ? "Administrar usuarios" :
                        "Inicio"
                    }
                    isDark={isDark}
                />
            </div>

            {/* 🟡 Sidebar de navegación (Viejo Sidebar) */}
            <div className={`flex flex-col m-2 w-full justify-evenly gap-2 p-2 rounded-lg border overflow-y-auto scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar
                ${isDark ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300 shadow-md'} transition-all duration-300`}
            >
                {
                    // Si está cargando, mostramos un esqueleto de carga
                    loading ? (
                        // Mostramos varios esqueletos mientras carga
                        <>
                            {[...Array(4)].map((_, i) => (
                                <NavButtonSqueleton key={i} isDark={isDark} />
                            ))}
                        </>
                    ) : (
                        // Agrupamos los botones por rol (USER y ADMIN), manteniendo el orden
                        Object.entries(groupedItems).map(([role, items]) => {
                            if (items.length === 0) return null;
                            return (
                                <React.Fragment key={role}>
                                    {/* 🔴 Separador de botones (Mostrar solo a los administradores) */}
                                    {
                                        user?.roles.includes(ROLES.ADMIN) && (
                                            <div className="relative my-2 flex items-center justify-center">
                                                <hr className="absolute w-full h-[1px] bg-gray-400 dark:bg-gray-600" />
                                                <span className={`relative z-10 px-2 text-xs font-semibold uppercase text-center tracking-wide rounded-full
                                                    ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-700'} shadow`}>
                                                    Acceso para {role === ROLES.ADMIN ? 'administradores' : 'usuarios'}
                                                </span>
                                            </div>
                                        )
                                    }
                                    {items.map(item => (
                                        <NavButton
                                            key={item.path}
                                            to={item.path}
                                            active={item.active}
                                            icon={item.icon}
                                            tooltip={item.tooltip}
                                            isDark={isDark}
                                        />
                                    ))}
                                </React.Fragment>
                            );
                        })
                    )  
                }
            </div>

            {/* 🔴 Contenedor de Contenido */}
            <div className={`flex flex-col m-4 p-3 border rounded-lg flex-1 shadow-lg overflow-y-auto scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar
                ${isDark ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} transition-all duration-300`}
            >
                {notificacion && <Notification {...notificacion} />}
                {<Outlet />}
                {<NavActions />}
            </div>
        </div>
    )
}

export default Dashboard;
