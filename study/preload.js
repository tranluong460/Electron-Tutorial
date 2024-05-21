const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  readFile: () => ipcRenderer.send("read-file"),
  readFolder: () => ipcRenderer.send("read-folder"),
  onFileData: (callback) =>
    ipcRenderer.on("file-data", (event, result) => callback(result)),
  onFolderData: (callback) =>
    ipcRenderer.on("folder-data", (event, result) => callback(result)),
  writeFile: (filePath, data) =>
    ipcRenderer.send("write-file", { filePath, data }),
  deleteFile: (filePath) => ipcRenderer.send("delete-file", filePath),
  onWriteStatus: (callback) =>
    ipcRenderer.on("file-write-status", (event, status) => callback(status)),
  onDeleteStatus: (callback) =>
    ipcRenderer.on("file-delete-status", (event, status) => callback(status)),
});
