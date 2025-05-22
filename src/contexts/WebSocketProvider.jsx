// src/contexts/WebSocketContext.jsx
import React, { createContext, useContext, useEffect, useRef } from "react";
import { useApp } from "@contexts/AppProvider";
import { useFiles } from "@contexts/FilesProvider";
import { useQR } from "@contexts/QRProvider";
import { useAuth } from "@contexts/AuthProvider";
import { useAdmin } from "@contexts/AdminProvider";

export const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
    const { handleNotificacion } = useApp();
    const { user } = useAuth();
    const ws = useRef(null);

    useEffect(() => {
        ws.current = new WebSocket(`ws://localhost:5000/api/v1/ws/notifications`);
        ws.current.onopen = () => {
            console.log("📡 WebSocket conectado");
        }

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.event === "file_uploaded") {
                console.log("📂 Nuevo archivo:", data.file_data);
                // Ej: refrescar lista
            }
        };

        ws.current.onclose = () => console.warn("❌ WebSocket cerrado");

        return () => ws.current?.close();
    }, []);

    return (
        <WebSocketContext.Provider value={ws.current}>
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
