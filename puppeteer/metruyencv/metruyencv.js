const { ipcMain } = require("electron");
const { app, BrowserWindow } = require("electron/main");
const path = require("node:path");
const puppeteer = require("puppeteer");
const fs = require("fs");
const slugify = require("slugify");

const getPathApp = (dir = [""]) => {
  return path.join(process.cwd(), "metruyencv", "data", ...dir);
};

function createWindow() {
  const win = new BrowserWindow({
    width: 400,
    height: 500,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // win.webContents.openDevTools();

  win.loadFile("metruyencv.html");

  ipcMain.on("scratch-book", async (_, payload) => {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
    });

    const page = await browser.newPage().catch(() => {
      console.log("Failed to browser");

      browser.close();
    });

    await page.goto(payload.bookUrl).catch(() => {
      console.log("Failed to goto page");

      browser.close();
    });

    await page
      .waitForSelector(
        "body > .min-h-screen.bg-auto > main > .space-y-5 > .pb-3 > .pt-6 > a > .text-sm"
      )
      .catch(() => {
        console.log("Failed to wait for selector page");
      });

    const lastChapter = await page
      .$eval(
        "body > .min-h-screen.bg-auto > main > .space-y-5 > .pb-3 > .pt-6 > a > .text-sm",
        (el) => el.innerHTML.replace(":", "").split(" ")[1]
      )
      .catch(() => {
        console.log("Failed to find last chapter");

        browser.close();
      });

    if (lastChapter) {
      const page2 = await browser.newPage();

      await page2.goto(`${payload.bookUrl}/chuong-${lastChapter}`);

      await page2.waitForSelector("body").catch(() => {
        console.log("Failed to wait for selector page 2");
      });

      const data = await page2
        .$eval("body > .min-h-screen.bg-auto > main", (el) => {
          return {
            name: el.querySelector(".mx-2 > h1 > a").innerHTML,
            title: el.querySelector(
              ".flex.justify-center.space-x-2.items-center.px-2 > div > h2"
            ).innerHTML,
            chapterDetail: el.querySelector("#chapter-detail > .break-words")
              .innerHTML,
          };
        })
        .catch(() => {
          console.log("Failed to get data chapter");

          browser.close();
        });

      const fileName = slugify(data.title, { locale: "vi", strict: true });
      const folderName = slugify(data.name, { locale: "vi", strict: true });

      if (!fs.existsSync(`${getPathApp()}\\${folderName}`)) {
        fs.mkdirSync(`${getPathApp()}\\${folderName}`, { recursive: true });
      }

      fs.writeFileSync(
        `${getPathApp()}\\${folderName}\\${fileName}.${payload.fileExtension}`,
        JSON.stringify(data),
        "utf8",
        (err) => {
          if (err) {
            console.log("Error writing data", err);
          } else {
            console.log("Success!");
          }
        }
      );
    }
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
