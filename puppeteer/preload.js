const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  openFacebook: () => {
    ipcRenderer.send("open-fb");
  },
  closeFacebook: () => {
    ipcRenderer.send("close-fb");
  },
  closeBrowser: () => {
    ipcRenderer.send("close-browser");
  },
  baseAccountFacebook: () => {
    ipcRenderer.send("base-account-facebook");
  },
  screenshotFacebook: () => {
    ipcRenderer.send("screenshot-fb");
  },
  accountFacebook: (callback) =>
    ipcRenderer.on("account-fb", (event, result) => callback(result)),
});

window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const type of ["chrome", "node", "electron"]) {
    replaceText(`${type}-version`, process.versions[type]);
  }
});
