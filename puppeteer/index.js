const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const puppeteer = require("puppeteer");

const getPathApp = (dir = [""]) => {
  return path.join(process.cwd(), ...dir);
};

function createWindow() {
  const win = new BrowserWindow({
    width: 400,
    height: 500,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("metruyencv.html");

  ipcMain.on("open-fb", async () => {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
    });

    const page = await browser.newPage();

    await page.goto("https://www.facebook.com/login");

    await page.exposeFunction("sendAccountDetails", (details) => {
      win.webContents.send("account-fb", details);
    });

    ipcMain.on("close-fb", async () => {
      await page.close();
    });

    ipcMain.on("close-browser", async () => {
      await browser.close();
    });

    ipcMain.on("base-account-facebook", async () => {
      await page.type("#email", "email-example@gmail.com");
      await page.type("#pass", "pass-example@gmail.com");
    });

    ipcMain.on("screenshot-fb", async () => {
      await page.screenshot({ path: `${getPathApp()}/images/screenshot.png` });
    });

    let email;
    let pass;

    await page.evaluate(() => {
      const inputEmail = document.querySelector("#email");
      const inputPass = document.querySelector("#pass");

      inputEmail.addEventListener("change", (e) => {
        email = e.target.value;
        window.sendAccountDetails({ email, pass });
      });

      inputPass.addEventListener("change", (e) => {
        pass = e.target.value;
        window.sendAccountDetails({ email, pass });
      });
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
