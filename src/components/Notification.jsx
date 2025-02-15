import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaRegTimesCircle, FaRegCheckCircle } from "react-icons/fa";
import { AiOutlineExclamationCircle } from "react-icons/ai";

const Notification = ({ type = "success", content, onClose, duration = 3000 }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            onClose && setTimeout(onClose, 500); // Espera la animación antes de remover el componente
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const colorclassNamees = {
        error: { bg: "bg-red-500", border: "border-red-700", iconBg: "bg-red-900" },
        success: { bg: "bg-blue-500", border: "border-blue-700", iconBg: "bg-blue-900" },
        warning: { bg: "bg-orange-500", border: "border-orange-700", iconBg: "bg-orange-900" },
    };

    let { bg, border, iconBg } = colorclassNamees[type] || colorclassNamees.warning;

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ y: -50, opacity: 0 }} // Comienza más arriba con opacidad 0
                    animate={{ y: 20, opacity: 1 }} // Baja hasta su posición final
                    exit={{ y: -50, opacity: 0 }} // Sube nuevamente al desaparecer
                    transition={{ type: "spring", stiffness: 100 }}
                    className={`fixed top-4 left-1/2 transform -translate-x-1/2 flex m-2 text-white rounded-lg shadow-lg ${bg} ${border}`}
                >
                    <div className={`h-full w-12 flex items-center justify-center rounded-l-lg p-6 ${iconBg}`}>
                        <span className="text-3xl">
                            {type === "error" ? <FaRegTimesCircle /> : type === "success" ? <FaRegCheckCircle /> : <AiOutlineExclamationCircle />}
                        </span>
                    </div>
                    <div className="flex items-center justify-center p-6 font-bold w-fit-content">
                        <p>{content}</p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Notification;
