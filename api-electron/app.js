const { app, BrowserWindow, dialog } = require("electron/main");

function createWindow() {
  const win = new BrowserWindow({
    width: 400,
    height: 300,
  });

  win.loadFile("index.html");
}

app.on("will-finish-launching", () => {
  console.log("Will finish launching...");
});

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("before-quit", (event) => {
  console.log("Before quit...");
});

app.on("will-quit", (event) => {
  console.log("Will quit...");
});

app.on("quit", (event) => {
  console.log("Quit...");
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
