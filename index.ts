import puppeteer from "puppeteer";
import path from "path";

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    timeout: 0,
    ignoreDefaultArgs: ["--enable-automation"],
    args: [
      "--kiosk",
      "--app",
      "--disable-infobars",
      "--silent",
      "--disable-gpu",
      "--disable-extensions",
      "--disable-dev-shm-usage",
      "--disable-setuid-sandbox",
      "--start-fullscreen",
    ],
    defaultViewport: null,
    protocolTimeout: 120000,
  });
  const page = await browser.newPage();
  await page.goto(`file://${path.join(__dirname, "index.html")}`);
})();
