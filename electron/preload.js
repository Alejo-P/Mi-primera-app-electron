const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    minimize: () => ipcRenderer.send("minimize"),
    maximize: () => ipcRenderer.send("maximize"),
    unmaximize: () => ipcRenderer.send("unmaximize"),
    close: () => ipcRenderer.send("close"),
    onMaximize: (callback) => ipcRenderer.on("maximized", callback),
    onUnmaximize: (callback) => ipcRenderer.on("unmaximized", callback),
    removeAllListeners: (event) => ipcRenderer.removeAllListeners(event),
});

window.addEventListener("DOMContentLoaded", () => {
    console.log("Preload script ejecutado");

    // Cambiar el color del body segun el tema (claro/oscuro)
    const body = document.querySelector("body");
    // Si no hay tema guardado, se establece el tema oscuro por defecto
    const tema = localStorage.getItem("tema") || "oscuro";
    // guardar el tema en localStorage
    localStorage.setItem("tema", tema);
});