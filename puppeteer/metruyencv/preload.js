const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  scratchBook: (payload) => {
    ipcRenderer.send("scratch-book", payload);
  },
});
