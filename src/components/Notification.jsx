import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaRegTimesCircle, FaRegCheckCircle } from "react-icons/fa";
import { MdOutlineWatchLater } from "react-icons/md";
import { IoMdNotifications } from "react-icons/io";
import { AiOutlineExclamationCircle } from "react-icons/ai";

const Notification = ({ type = "success", content, onClose, duration = 3000 }) => {
    const [visible, setVisible] = useState(true);
    const [progressKey, setProgressKey] = useState(0);

    const handleHover = () => {
        // Detener la barra de progreso al pasar el mouse
        setVisible(false);

    }

    useEffect(() => {
        setProgressKey(prev => prev + 1); // Trigger para reiniciar barra
        setVisible(true);
        const timer = setTimeout(() => {
            setVisible(false);
            onClose && setTimeout(onClose, 500);
        }, duration);
        return () => clearTimeout(timer);
    }, [content, duration, onClose]);

    const colorClasses = {
        error: { bg: "bg-red-500", border: "border-red-700", iconBg: "bg-red-900", icon: <FaRegTimesCircle /> },
        success: { bg: "bg-blue-500", border: "border-blue-700", iconBg: "bg-blue-900", icon: <FaRegCheckCircle /> },
        warning: { bg: "bg-orange-500", border: "border-orange-700", iconBg: "bg-orange-900", icon: <AiOutlineExclamationCircle /> },
        info: { bg: "bg-gray-500", border: "border-gray-700", iconBg: "bg-gray-900", icon: <AiOutlineExclamationCircle /> },
        timeout: { bg: "bg-yellow-600", border: "border-yellow-800", iconBg: "bg-yellow-900", icon: <MdOutlineWatchLater /> },
        default: { bg: "bg-gray-500", border: "border-gray-700", iconBg: "bg-gray-900", icon: <IoMdNotifications /> }
    };

    let { bg, border, iconBg, icon } = colorClasses[type.toLowerCase()] || colorClasses.warning;

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 20, opacity: 1 }}
                    exit={{ y: -50, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className={`overflow-hidden fixed top-4 z-100 left-1/2 transform -translate-x-1/2 flex w-auto max-w-xs md:max-w-lg lg:max-w-2xl text-white rounded-lg shadow-lg ${bg} ${border}`}
                >
                    {/* Icono de la notificación */}
                    <div className={`flex items-center justify-center px-4 ${iconBg} rounded-l-lg`}>
                        <span className="text-3xl">
                            {icon}
                        </span>
                    </div>

                    {/* Contenido de la notificación */}
                    <div className="flex-1 p-4">
                        <p className="break-words">{content}</p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Notification;
