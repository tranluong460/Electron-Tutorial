const { app, BrowserWindow, dialog } = require("electron");

function createWindow() {
  const win = new BrowserWindow({
    width: 400,
    height: 300,
  });

  win.loadFile("index.html");

  win.on("blur", () => {
    console.log("Xay ra khi cua so trinh duyet mat tieu diem.");
  });

  win.on("focus", () => {
    console.log("Xay ra khi cua so trinh duyet co tieu diem.");
  });
}

app.on("will-finish-launching", () => {
  console.log("Xay ra khi ung dung chuan bi hoan tat viec khoi dong.");
});

app.whenReady().then(() => {
  console.log(
    "Xay ra khi Electron hoan tat viec khoi dong va san sang tao cua so trinh duyet."
  );

  const version = app.getVersion();
  const locale = app.getLocale();
  const country = app.getLocaleCountryCode();
  const systemLocale = app.getSystemLocale();
  const preferredSystemLanguages = app.getPreferredSystemLanguages();

  console.log({
    version,
    locale,
    country,
    systemLocale,
    preferredSystemLanguages,
  });

  createWindow();

  app.on("activate", () => {
    console.log("Xay ra khi ung dung duoc kich hoat.");
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("before-quit", (event) => {
  console.log("Xay ra truoc khi ung dung thoat.");
});

app.on("will-quit", (event) => {
  console.log("Xay ra khi ung dung sap thoat.");
});

app.on("quit", (event) => {
  console.log("Xay ra khi ung dung da thoat.");
});

app.on("window-all-closed", () => {
  console.log("Xay ra khi tat ca cac cua so cua ung dung da dong.");
  if (process.platform !== "darwin") {
    app.quit();
  }
});
