// src/contexts/WebSocketContext.jsx
import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { useApp } from "@contexts/AppProvider";
import { useFiles } from "@contexts/FilesProvider";
import { useQR } from "@contexts/QRProvider";
import { useAuth } from "@contexts/AuthProvider";
import { useAdmin } from "@contexts/AdminProvider";

import { ROLES } from "@constants/roles";

export const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
    const { handleNotificacion } = useApp();
    const { setUsersList } = useAdmin();
    const { setFileList } = useFiles();
    const { setQRList } = useQR();
    const { user, logout, setUser } = useAuth();
    const ws = useRef(null);
    const [connectionStatus, setConnectionStatus] = useState("disconnected"); 
    const reconnectAttempts = useRef(0);
    const reconnecting = useRef(false);
    const pendingMessages = useRef([]);

    const isUserAdmin = () => {
        return (Object.keys(user).length > 0 && user.roles?.includes(ROLES.ADMIN))
    }

    const send_message = (message) => {
        const str = JSON.stringify(message);
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(str);
        } else {
            console.warn("⏳ WebSocket no conectado aún. Agregando a la cola:", message);
            pendingMessages.current.push(str);
        }
    }

    const reconnectWithBackoff = () => {
        reconnectAttempts.current += 1;
        const delay = Math.min(30000, 2000 * reconnectAttempts.current); // Hasta 30s máx
        console.log(`🔁 Reintentando conexión en ${delay / 1000}s...`);

        setTimeout(() => {
            start_websocket();
        }, delay);
    };

    const start_websocket = () => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            console.warn("⏳ WebSocket ya conectado");
            return;
        }

        setConnectionStatus("connecting");
        ws.current = new WebSocket(`ws://localhost:5000/api/v1/ws`);

        ws.current.onopen = () => {
            console.log("📡 WebSocket conectado");
            setConnectionStatus("connected");
            reconnectAttempts.current = 0;
            reconnecting.current = false;

            while (pendingMessages.current.length > 0) {
                const msg = pendingMessages.current.shift();
                ws.current.send(msg);
            }
        };

        ws.current.onmessage = (event) => {
            const wsmsg = JSON.parse(event.data);
            console.log("📩 Mensaje recibido:", wsmsg);

            if (wsmsg.event === "user_connected" && isUserAdmin()) {
                // Solo los administradores reciben eventos de conexión/desconexión de usuarios
                console.log("👤 Usuario conectado:", wsmsg.user_id);
                setUsersList((prev) => prev.map((user) => user.id === wsmsg.user_id ? { ...user, is_connected: true } : user));
            }

            if (wsmsg.event === "user_disconnected" && isUserAdmin()) {
                // Solo los administradores reciben eventos de conexión/desconexión de usuarios
                console.log("👤 Usuario desconectado:", wsmsg.user_id);
                setUsersList((prev) => prev.map((user) => user.id === wsmsg.user_id ? { ...user, is_connected: false } : user));
            }

            if (wsmsg.event === "user_activated" && isUserAdmin()) {
                // Solo los administradores reciben eventos de activación/desactivación de usuarios
                console.log("👤 Usuario activado:", wsmsg.user_id);
                setUsersList((prev) => prev.map((user) => user.id === wsmsg.user_id ? { ...user, is_active: true } : user));
            }

            if (wsmsg.event === "user_deactivated") {
                // Este evento lo reciben todos los usuarios, ya que puede afectar al usuario actual
                if (isUserAdmin()) {
                    // Actualizar la lista de usuarios
                    console.log("👤 Usuario desactivado:", wsmsg.user_id);
                    setUsersList((prev) => prev.map((user) => user.id === wsmsg.user_id ? { ...user, is_active: false } : user));
                }
                
                // Si el usuario desactivado es el actual, cerrar sesión
                if (wsmsg.user_id === user.id) {
                    console.warn("⚠️ Tu cuenta ha sido desactivada. Cerrando sesión...");
                    handleNotificacion("error", "Tu cuenta ha sido desactivada. Por favor, contacta al administrador.", 5000);
                    setTimeout(() => {
                        close_websocket();
                        logout();
                    }, 2000);
                }
            }

            if (wsmsg.event === "user_updated") {
                // Este evento lo reciben todos los usuarios, ya que puede afectar al usuario actual
                if (isUserAdmin()) {
                    // Actualizar la lista de usuarios
                    console.log("👤 Usuario actualizado:", wsmsg.user_id);
                    setUsersList((prev) => prev.map((user) => user.id === wsmsg.user_id ? wsmsg.user : user));
                }
                console.log(user, typeof user.id, wsmsg.user, typeof wsmsg.user);
                // Si el usuario actualizado es el actual, actualizar el contexto
                if (wsmsg.user_id === user.id) {
                    handleNotificacion("info", "Tu información ha sido actualizada", 5000);
                    // Actualizar el contexto del usuario actual
                    setUser(wsmsg.user);
                }
            }

            if (wsmsg.event === "avatar_updated") {
                // Este evento lo reciben todos los usuarios, ya que puede afectar al usuario actual
                if (isUserAdmin()) {
                    // Actualizar la lista de usuarios
                    console.log("🖼️ Avatar actualizado:", wsmsg.user_id);
                    setUsersList((prev) => prev.map((user) => user.id === wsmsg.user_id ? { ...user, avatar: wsmsg.avatar } : user));
                }

                // Si el usuario actualizado es el actual, actualizar el contexto
                if (wsmsg.user_id === user.id) {
                    handleNotificacion("info", "Tu avatar ha sido actualizado", 5000);
                    // Actualizar el contexto del usuario actual
                    setUser((prev) => ({ ...prev, avatar: wsmsg.avatar }));
                }
            }

            if (wsmsg.event === "role_added") {
                // Este evento lo reciben todos los usuarios, ya que puede afectar al usuario actual
                if (isUserAdmin()) {
                    // Actualizar la lista de usuarios
                    console.log("👥 Rol agregado:", wsmsg.role_name);
                    setUsersList((prev) => prev.map((user) => user.id === wsmsg.user_id ? { ...user, roles: [...user.roles, wsmsg.role_name] } : user));
                }

                // Si el usuario actualizado es el actual, actualizar el contexto
                if (wsmsg.user_id === user.id) {
                    handleNotificacion("info", `Se te otorgó el rol "${wsmsg.role_name}"`, 5000);
                    // Actualizar el contexto del usuario actual
                    setUser((prev) => ({ ...prev, roles: [...prev.roles, wsmsg.role_name] }));
                }
            }

            if (wsmsg.event === "role_removed") {
                // Este evento lo reciben todos los usuarios, ya que puede afectar al usuario actual
                if (isUserAdmin()) {
                    // Actualizar la lista de usuarios
                    console.log("👥 Rol eliminado:", wsmsg.role_name);
                    setUsersList((prev) => prev.map((user) => user.id === wsmsg.user_id ? { ...user, roles: user.roles.filter(role => role !== wsmsg.role_name) } : user));
                }

                // Si el usuario actualizado es el actual, actualizar el contexto
                if (wsmsg.user_id === user.id) {
                    handleNotificacion("info", `Se te revocó el rol "${wsmsg.role_name}"`, 5000);
                    // Actualizar el contexto del usuario actual
                    setUser((prev) => ({ ...prev, roles: prev.roles.filter(role => role !== wsmsg.role_name) }));
                }
            }

            if (wsmsg.event === "file_uploaded") {
                console.log("📂 Nuevo archivo:", wsmsg.file_data);
                setFileList((prev) => [...prev, wsmsg.file_data]);
            }

            if (wsmsg.event === "file_deleted") {
                console.log("🗑️ Archivo eliminado:", wsmsg.file_id, wsmsg.data?.filename);
                setFileList((prev) => prev.filter((file) => file.id !== wsmsg.data?.file_id));

                // Si el archivo eliminado contenia un QR, eliminarlo
                setQRList((prev) => prev.filter((qr) => qr?.attached_file?.filename !== wsmsg.data?.filename));
            }

            if (wsmsg.event === "all_files_deleted") {
                console.log("🗑️ Todos los archivos eliminados, con Ids", wsmsg.data?.files_ids);
                setFileList(list => list.filter(file => !wsmsg.data?.files_ids.includes(file.id)));

                // Si los archivo eliminados contenian el QR, eliminarlo
                setQRList(list => list.filter(qr => !wsmsg.data?.qrs_ids.includes(qr.id)));
            }

            if (wsmsg.event === "qr_created" || wsmsg.event === "qr_generated") {
                console.log("🆕 Nuevo QR:", wsmsg.qr_data);
                setQRList((prev) => [...prev, wsmsg.qr_data]);
            }

            if (wsmsg.event === "qr_deleted") {
                console.log("🗑️ QR eliminado:", wsmsg.qr_id, wsmsg.data?.filename);
                setQRList((prev) => prev.filter((qr) => qr.id !== wsmsg.data?.qr_id));
            }

            if (wsmsg.event === "all_qrs_deleted") {
                console.log("🗑️ Todos los QRs eliminados, con Ids", wsmsg.data?.qrs_ids);
                setQRList(list => list.filter(qr => !wsmsg.data?.qrs_ids.includes(qr.id)));
            }
        };

        ws.current.onclose = (event) => {
            console.warn("❌ WebSocket cerrado", event);
            setConnectionStatus("disconnected");

            // Si el código indica error de autorización, no reintentes
            if (event.code === 1008 || event.code === 4003) {
                console.error("⛔ WebSocket cerrado por error de autenticación. No se reintentará.");
                return;
            }

            if (!reconnecting.current) {
                reconnecting.current = true;
                reconnectWithBackoff();
            }
        };

        ws.current.onerror = (event) => {
            console.error("💥 Error en WebSocket:", event);
            ws.current.close(); // Cierra forzadamente si hubo error
        };
    };

    const close_websocket = () => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            console.log("🔌 Cerrando WebSocket manualmente");
            ws.current.close();
            ws.current = null;
        } else {
            console.warn("⏳ WebSocket no está abierto o ya cerrado");
        }
    }

    useEffect(() => {
        if (Object.keys(user).length === 0) return;
        start_websocket();

        return () => {
            // Cerrar la conexion cuando el estado del usuario sea un objeto vacío
            if (ws.current && ws.current.readyState === WebSocket.OPEN && Object.keys(user).length === 0) {
                console.log("🔌 Cerrando WebSocket al desmontar el componente");
                ws.current.close();
                ws.current = null;
            }
        };
    }, [user]);

    const contextValue = {
        ws: ws.current,
        connectionStatus,
        send_message,
        start_websocket,
        close_websocket
    }

    return (
        <WebSocketContext.Provider value={contextValue}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error("useWebSocket must be used within a WebSocketProvider");
    }
    return context;
};
