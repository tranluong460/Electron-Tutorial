const { app, BrowserWindow } = require("electron/main");

function createWindow() {
  const win = new BrowserWindow({
    show: false,
    width: 400,
    height: 300,
    backgroundColor: "#bbb",
  });

  win.once("ready-to-show", () => {
    win.show();
  });

  win.loadFile("index.html");
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
