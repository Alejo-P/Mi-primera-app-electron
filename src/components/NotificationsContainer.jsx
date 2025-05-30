// NotificationsContainer.jsx
import React from "react";
import Notification from "./Notification";
import { useApp } from "@contexts/AppProvider";

const NotificationsContainer = () => {
    const { notificacionList, handleCloseNotificacion } = useApp();

    return (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 flex flex-col gap-2 z-100">
            {notificacionList.map(n => (
                <Notification
                    key={n.id}
                    type={n.type}
                    content={n.content}
                    duration={n.duration}
                    actionButtons={n.actionButtons}
                    onClose={() => handleCloseNotificacion(n.id)}
                />
            ))}
        </div>
    );
};

export default NotificationsContainer;
