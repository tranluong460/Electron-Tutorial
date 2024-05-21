const fs = require("fs");
const path = require("path");
const { app, BrowserWindow, ipcMain, dialog } = require("electron");

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.webContents.openDevTools();

  mainWindow.loadFile("index.html");

  ipcMain.on("read-file", async () => {
    const result = await dialog.showOpenDialog({
      properties: ["openFile"],
      filters: [{ name: "TXT, JSON", extensions: ["txt", "json"] }],
    });

    if (result.canceled || result.filePaths.length === 0) {
      mainWindow.webContents.send("file-data", { error: "No file selected" });
      return;
    }

    const filePath = result.filePaths[0];

    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        mainWindow.webContents.send("file-data", { error: err.message });
      } else {
        mainWindow.webContents.send("file-data", { data, filePath });
      }
    });
  });

  ipcMain.on("read-folder", async () => {
    const result = await dialog.showOpenDialog({
      properties: ["openDirectory"],
    });

    if (result.canceled || result.filePaths.length === 0) {
      mainWindow.webContents.send("folder-data", {
        error: "No folder selected",
      });
      return;
    }

    const filePath = result.filePaths[0];

    fs.readdir(filePath, "utf8", (err, data) => {
      if (err) {
        mainWindow.webContents.send("folder-data", { error: err.message });
      } else {
        mainWindow.webContents.send("folder-data", { data, filePath });
      }
    });
  });

  ipcMain.on("write-file", (event, { filePath, data }) => {
    fs.writeFile(filePath, data, "utf8", (err) => {
      if (err) {
        mainWindow.webContents.send("file-write-status", {
          success: false,
          error: err.message,
        });
      } else {
        mainWindow.webContents.send("file-write-status", { success: true });
      }
    });
  });

  ipcMain.on("delete-file", (event, filePath) => {
    fs.unlink(filePath, (err) => {
      if (err) {
        mainWindow.webContents.send("file-delete-status", {
          success: false,
          error: err.message,
        });
      } else {
        mainWindow.webContents.send("file-delete-status", { success: true });
      }
    });
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
