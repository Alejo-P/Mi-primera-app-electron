import { app, BrowserWindow, ipcMain } from "electron";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
let server;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    //frame: false, // Oculta la barra de título nativa
    //titleBarStyle: "hidden", // Opcional: Oculta la barra pero mantiene los botones en macOS
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  const startURL =
    process.env.ELECTRON_START_URL ||
    `file://${path.join(__dirname, "../dist/react/index.html")}`;
  //mainWindow.loadURL(startURL); // Cargar React en modo desarrollo

  mainWindow.loadURL("http://localhost:5173"); // Cargar React en modo desarrollo
  
  // Escuchar eventos de maximización/restauración
  mainWindow.on("maximize", () => mainWindow.webContents.send("maximized"));
  mainWindow.on("unmaximize", () => mainWindow.webContents.send("unmaximized"));
  
  ipcMain.on("minimize", () => mainWindow.minimize());
  ipcMain.on("maximize", () => mainWindow.maximize());
  ipcMain.on("unmaximize", () => mainWindow.restore());
  ipcMain.on("close", () => mainWindow.close());

  // Iniciar el servidor backend compilado (Python Flask API)
  const serverPath = path.join(__dirname, "backend", "server.exe");
  if (fs.existsSync(serverPath)) {
    server = spawn(serverPath, [], { detached: true, stdio: "ignore" });
    server.unref();
  } else {
    console.error("⚠️ No se encontró el server.exe en:", serverPath);
  }
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

  if (server) {
    server.kill("SIGTERM");
  }
});
