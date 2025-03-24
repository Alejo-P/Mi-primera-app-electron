// @ts-check
import { app, BrowserWindow, ipcMain } from "electron";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
let server;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false, // Oculta la barra de título nativa
    titleBarStyle: "hidden", // Opcional: Oculta la barra pero mantiene los botones en macOS
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true
    },
  });

  const startURL = process.env.ENV === "development" ? 
  process.env.REACT_DEV_URL : // Cargar React en modo desarrollo
  `file://${path.join(__dirname, "../dist/react/index.html")}`; // Cargar React en modo produccion

  mainWindow.loadURL(startURL); // Cargar la URL de inicio
  
  // Escuchar eventos de maximización/restauración
  mainWindow.on("maximize", () => mainWindow.webContents.send("maximized"));
  mainWindow.on("unmaximize", () => mainWindow.webContents.send("unmaximized"));

  // Manejar la apertura de nuevas ventanas
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    createNewWindow(url); // Llamamos a la función que crea la ventana
    return { action: "deny" }; // Evita que se abra en la misma ventana
  });
  // Enviar el estado de maximización al frontend
  ipcMain.handle("is-window-maximized", () => mainWindow.isMaximized());
  ipcMain.on("minimize", () => mainWindow.minimize());
  ipcMain.on("maximize", () => mainWindow.maximize());
  ipcMain.on("unmaximize", () => mainWindow.restore());
  ipcMain.on("close", () => mainWindow.close());
  
});

app.on("quit", () => {
  if (server) {
    server.kill("SIGTERM");
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Función para crear una nueva ventana
function createNewWindow(url) {
  let newWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: "Nueva Ventana",
    webPreferences: {
      nodeIntegration: false,
    },
  });

  newWindow.loadURL(url);

  newWindow.on("closed", () => {
    newWindow = null;
  });
}
