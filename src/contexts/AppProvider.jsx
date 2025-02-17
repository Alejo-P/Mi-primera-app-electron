import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [tema, setTema] = useState(localStorage.getItem("tema") || "oscuro");
    const [notificacion, setNotificacion] = useState(null);
    const [extensiones] = useState(["txt", "pdf", "png", "jpg", "jpeg", "gif"]);
    const [fileTypes] = useState({
        documents: ["txt", "pdf"],
        images: ["png", "jpg", "jpeg", "gif"],
    })
    const URL_BACKEND = import.meta.env.VITE_BACKEND_URL;

    // Cambia el tema y lo guarda en localStorage
    const handleTheme = () => {
        const nuevoTema = tema === "claro" ? "oscuro" : "claro";
        setTema(nuevoTema);
        localStorage.setItem("tema", nuevoTema);
    };

    // Muestra una notificación temporalmente
    const handleNotificacion = (type, content, timeout = 3000) => {
        setNotificacion({ 
            type,
            content,
            onClose: () => setNotificacion(null),
            duration: timeout
        });
    };

    // Aplica la clase del tema al body cuando cambia
    useEffect(() => {
        document.body.classList.remove("bg-gray-800", "bg-white");
        document.body.classList.add(tema === "claro" ? "bg-white" : "bg-gray-800");
    }, [tema]);

    // Memoriza el valor del contexto para evitar renders innecesarios
    const contextValue = useMemo(() => ({ tema, handleTheme, notificacion, handleNotificacion, extensiones, fileTypes }), [tema, notificacion]);

    return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export const useApp = () => useContext(AppContext);