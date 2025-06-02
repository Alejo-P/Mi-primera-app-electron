import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [tema, setTema] = useState(localStorage.getItem("tema") || "oscuro");
    const [notificacionList, setNotificacionList] = useState([]);
    const [extensiones] = useState(["txt", "pdf", "png", "jpg", "jpeg", "gif"]);
    const [maxSize] = useState(16777216); // 16MB
    const [fileTypes] = useState({
        documents: ["txt", "pdf"],
        images: ["png", "jpg", "jpeg", "gif"],
    })
    const [selectedFile, setSelectedFile] = useState(null);
    const [currentPath, setCurrentPath] = useState(null);
    const [visibleNav, setVisibleNav] = useState(true);
    const [navActionsItems, setNavActionsItems] = useState([]);
    const [visibleToolbar, setVisibleToolbar] = useState(true);
    const [showOptions, setShowOptions] = useState(false);
    const [showLogsModal, setShowLogsModal] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);
    // Deteccion de Electron
    const [isElectron, setIsElectron] = useState(false);


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
    const handleNotificacion = (type, content, duration = 3000, actionButtons = []) => {
        if (!content) return;
        let message = content?.response?.data?.msg 
           ?? content?.response?.data?.error 
           ?? content?.message 
           ?? content;

        // Si el mensaje es un objeto, lo convierte a string
        if (typeof message === "object") {
            try {
                message = JSON.stringify(message);
            } catch (error) {
                console.error("Error al convertir el mensaje a string:", error);
            }
        }

        // Si el mensaje es muy largo, lo acorta
        if (message.length > 100) {
            message = message.slice(0, 100) + "...";
        }

        // Si el mensaje es un string vacío, no muestra la notificación
        if (!message || message.trim() === "") return;

        const id = Date.now();
        setNotificacionList(prev => [...prev, { id, type, content, duration, actionButtons }]);
    };

    const handleCloseNotificacion = (id) => {
        setNotificacionList(prev => prev.filter(n => n.id !== id));
    }

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

    // Detecta si la aplicación se está ejecutando en Electron
    useEffect(() => {
        if (window?.electronAPI) {
            setIsElectron(true);
        }
    }, []);

    // Memoriza el valor del contexto para evitar renders innecesarios
    const contextValue = useMemo(() => ({
        tema,
        notificacionList,
        selectedFile,
        extensiones,
        fileTypes,
        maxSize,
        currentPath,
        visibleNav,
        showOptions,
        isMaximized,
        showLogsModal,
        visibleToolbar,
        isElectron,
        navActionsItems,
        setNavActionsItems,
        setVisibleToolbar,
        setShowLogsModal,
        setIsMaximized,
        handleOptions,
        setVisibleNav,
        setCurrentPath,
        setSelectedFile,
        handleNotificacion,
        handleCloseNotificacion,
        setNotificacionList,
        convertUnit,
        handleTheme,
    }), [tema, notificacionList, selectedFile, currentPath, visibleNav, showOptions, isMaximized, showLogsModal, visibleToolbar, isElectron, navActionsItems]);

    return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useApp must be used within an AppProvider");
    }
    return context;
};