import React, { useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { HiHome } from "react-icons/hi";
import { FaQrcode } from 'react-icons/fa6';
import { FaRegFileAlt, FaUser, FaBars, FaUsersCog, FaTimes } from "react-icons/fa";

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
import SideBar from '@components/SideBar';

// Importamos los hooks
import { useWindowSize } from '@hooks/useWindowSize';

const Dashboard = () => {
    const { profile, user, loading } = useAuth();
    const { notificacion, tema, setCurrentPath, setVisibleNav } = useApp();
    const { setFileList } = useFiles();
    const { setQRList } = useQR();
    const { setUsersList, setRolesList } = useAdmin();
    const { pathname } = useLocation();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { width } = useWindowSize();
    const isDark = tema === THEMES.DARK;

    // Función para cerrar el Drawer
    const handleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    async function loadProfile() {
        await profile();
    }

    const filterButtons = (userRoles, buttonRoles) => {
        return buttonRoles.some(rol => userRoles.includes(rol));
    };

    const handleRefresh = () => {
        loadProfile();
    }

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
        if (item.accessBy.includes(ROLES.USER) || item.accessBy.includes(ROLES.ALL)) {
            // Si el botón es accesible por admin, lo mandamos ahí. Si no, va a user
            groupedItems[ROLES.USER].push(item);
        } else {
            groupedItems[ROLES.ADMIN].push(item);
        }
    });

    const hasItems = Object.values(groupedItems).some(items => items.length > 0);

    // Si el drawer está abierto y la pantalla es mayor a 768px, cerramos el drawer
    useEffect(() => {
        if (drawerOpen && width >= 768) {
            setDrawerOpen(false);
        }
    }, [width]);

    // Si el drawer está abierto, ocultamos la barra de navegación
    useEffect(() => {
        setVisibleNav(!drawerOpen);
    }, [drawerOpen]);

    useEffect(() => {
        setCurrentPath(pathname);
        // Si la ruta cambia, cerramos el drawer
        if (drawerOpen && width < 768) {
            setDrawerOpen(false);
        }
    }, [pathname]); // Se ejecuta cuando cambia la ruta

    //Cargar el perfil del usuario
    useEffect(() => {
        if (!Object.keys(user).length) loadProfile();

        // Limpiar los datos de los contextos al desmontar el componente
        return () => {
            setFileList([]);
            setQRList([]);
            setUsersList([]);
            setRolesList([]);
        };
    }, []); // Se ejecuta cuando cambia el usuario del usuario

    return (
        <div className={`grid grid-cols-1 md:grid-cols-[23%_77%] grid-rows-[40px_50px_1fr] h-screen transition-all duration-300 min-w-[525px] scrollbar-track-transparent
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

            {/* Botón para abrir el Drawer */}
            <button 
                onClick={handleDrawer}
                data-tooltip-id="drawerLabel"
                className={`md:hidden fixed top-14 left-4
                    ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-300 text-gray-900'}
                    ${loading ? 'animate-pulse cursor-not-allowed' : 'cursor-pointer hover:bg-gray-400 hover:text-gray-800'}
                    ${drawerOpen ? 'hover:bg-gray-600 z-110' : 'hover:bg-gray-400 z-30'}
                    hover:scale-95 shadow-lg hover:shadow-xl rounded-lg transition-all duration-300 p-2`}
            >
                {drawerOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
            </button>

            {/* Contenedor del Drawer */}
            {(drawerOpen && width < 768) && (
                <SideBar
                    isDark={isDark}
                    isLoading={loading}
                    groupedItems={groupedItems}
                    user={user}
                    handleDrawer={handleDrawer}
                    handleRefresh={handleRefresh}
                    drawerOpen={drawerOpen}
                />
            )}

            <div className={`hidden md:flex flex-col m-2 w-full justify-evenly gap-2 p-2 rounded-lg border overflow-y-auto scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar
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
                    ) : hasItems ? (
                        // Agrupamos los botones por rol (USER y ADMIN), manteniendo el orden
                        Object.entries(groupedItems).map(([role, items]) => {
                            if (items.length === 0) return null;
                            return (
                                <React.Fragment key={role}>
                                    {/* 🔴 Separador de botones (Mostrar solo a los administradores) */}
                                    {
                                        user?.roles.includes(ROLES.ADMIN) && (
                                            <div className={`text-sm font-semibold uppercase text-center mb-2 mt-2 px-3 py-1 rounded
                                                ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'} shadow`}>
                                                Acceso para {role === ROLES.ADMIN ? 'administradores' : 'usuarios'}
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
                    ) : (
                        // Si no hay botones, mostramos un mensaje
                        <div className={`flex flex-col items-center justify-center h-full`}>
                            <div className={`text-sm font-semibold uppercase text-center mb-2 mt-2 px-3 py-1 rounded
                                ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'} shadow`}>
                                No tienes acceso a ninguna sección
                            </div>
                            <div className={`text-sm font-semibold uppercase text-center mb-2 mt-2 px-3 py-1 rounded
                                ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'} shadow`}>
                                Comunicate con un administrador o intenta
                                <button
                                    onClick={handleRefresh}
                                    className={`text-blue-500 hover:text-blue-700 uppercase ml-1`}
                                >
                                    Recargar
                                </button>
                            </div>
                        </div>
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
