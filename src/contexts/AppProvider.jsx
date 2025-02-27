import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [tema, setTema] = useState(localStorage.getItem("tema") || "oscuro");
    const [notificacion, setNotificacion] = useState(null);
    const [extensiones] = useState(["txt", "pdf", "png", "jpg", "jpeg", "gif"]);
    const [maxSize] = useState(16777216); // 16MB
    const [fileTypes] = useState({
        documents: ["txt", "pdf"],
        images: ["png", "jpg", "jpeg", "gif"],
    })
    const [ selectedFile, setSelectedFile ] = useState(null);
    const [ currentPath, setCurrentPath ] = useState(null);
    const [ visibleNav, setVisibleNav ] = useState(true);
    const [ showOptions, setShowOptions ] = useState(false);

    // Cambia el tema y lo guarda en localStorage
    const handleTheme = () => {
        const nuevoTema = tema === "claro" ? "oscuro" : "claro";
        setTema(nuevoTema);
        localStorage.setItem("tema", nuevoTema);
    };

    const handleOptions = () => {
        setShowOptions(!showOptions);
    }

    // Muestra una notificación temporalmente
    const handleNotificacion = (type, content, timeout = 3000) => {
        setNotificacion({ 
            type,
            content,
            onClose: () => setNotificacion(null),
            duration: timeout
        });
    };

    // Convertir unidad de medida de bytes a cualquier otra
    const convertUnit = (bytes, unit = "MB") => {
        const units = { B: 1, KB: 1024, MB: 1048576, GB: 1073741824 };
        return (bytes / units[unit]).toFixed(2) + unit.padStart(3, " ");
    };

    // Aplica la clase del tema al body cuando cambia
    useEffect(() => {
        document.body.classList.remove("bg-gray-800", "bg-white");
        document.body.classList.add(tema === "claro" ? "bg-white" : "bg-gray-800");
    }, [tema]);

    // Memoriza el valor del contexto para evitar renders innecesarios
    const contextValue = useMemo(() => ({
        tema,
        notificacion,
        selectedFile,
        extensiones,
        fileTypes,
        maxSize,
        currentPath,
        visibleNav,
        showOptions,
        handleOptions,
        setVisibleNav,
        setCurrentPath,
        setSelectedFile,
        handleNotificacion,
        convertUnit,
        handleTheme,
    }), [tema, notificacion, selectedFile, currentPath, visibleNav, showOptions]);

    return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export const useApp = () => useContext(AppContext);