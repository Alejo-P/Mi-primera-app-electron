import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { FaRegTimesCircle, FaRegCheckCircle } from "react-icons/fa";
import { MdOutlineWatchLater } from "react-icons/md";
import { IoMdNotifications } from "react-icons/io";
import { AiOutlineExclamationCircle } from "react-icons/ai";

const Notification = ({
    type = "success",
    content,
    onClose,
    duration = 3000,
    actionButtons = []
}) => {
    const [visible, setVisible] = useState(true);
    const [progressWidth, setProgressWidth] = useState("100%");

    useEffect(() => {
        let start = Date.now();
        let frame;

        const animate = () => {
            const elapsed = Date.now() - start;
            const percent = Math.max(0, 100 - (elapsed / duration) * 100);
            setProgressWidth(`${percent}%`);
            if (elapsed < duration) {
                frame = requestAnimationFrame(animate);
            }
        };

        animate();

        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(() => onClose && onClose(), 300);
        }, duration);

        return () => {
            clearTimeout(timer);
            cancelAnimationFrame(frame);
        };
    }, []);

    const colorClasses = {
        error: { bg: "bg-red-500", border: "border-red-700", iconBg: "bg-red-900", icon: <FaRegTimesCircle /> },
        success: { bg: "bg-blue-500", border: "border-blue-700", iconBg: "bg-blue-900", icon: <FaRegCheckCircle /> },
        warning: { bg: "bg-orange-500", border: "border-orange-700", iconBg: "bg-orange-900", icon: <AiOutlineExclamationCircle /> },
        info: { bg: "bg-gray-500", border: "border-gray-700", iconBg: "bg-gray-900", icon: <AiOutlineExclamationCircle /> },
        timeout: { bg: "bg-yellow-600", border: "border-yellow-800", iconBg: "bg-yellow-900", icon: <MdOutlineWatchLater /> },
        default: { bg: "bg-gray-500", border: "border-gray-700", iconBg: "bg-gray-900", icon: <IoMdNotifications /> }
    };

    const { bg, border, iconBg, icon } = colorClasses[type.toLowerCase()] || colorClasses.default;

    const buttons = actionButtons.length > 0 ? actionButtons : [{
        label: "Cerrar",
        onClick: () => {
            setVisible(false);
            setTimeout(() => onClose && onClose(), 300);
        }
    }];

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 20, opacity: 1 }}
                    exit={{ y: -50, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className={`overflow-hidden flex w-auto max-w-xs md:max-w-lg lg:max-w-2xl text-white rounded-lg shadow-lg ${bg} ${border}`}
                >
                    {/* Icono */}
                    <div className={`flex items-center justify-center px-4 ${iconBg} rounded-l-lg`}>
                        <span className="text-3xl">{icon}</span>
                    </div>

                    {/* Contenido */}
                    <div className="flex flex-col justify-between flex-1 p-4 gap-2">
                        <p className="break-words">{content}</p>
                        <div className="flex gap-2 mt-2 flex-wrap">
                            {buttons.map((btn, i) => (
                                <button
                                    key={i}
                                    onClick={btn.onClick}
                                    className="bg-white/20 px-3 py-1 rounded hover:bg-white/30 transition text-sm"
                                >
                                    {btn.label}
                                </button>
                            ))}
                        </div>
                        <div className="h-1 w-full bg-white/30 mt-2 rounded overflow-hidden">
                            <div
                                className="h-full bg-white/70 transition-all ease-linear"
                                style={{ width: progressWidth }}
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Notification;
