import puppeteer from "puppeteer";

import { Credentials } from "@/@types";

export async function scrappingPandaToken({ email, password }: Credentials) {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--disable-software-rasterizer",
    ],
    protocolTimeout: 600000, // Timeout de 10 minutes
  });

  const page = await browser.newPage();

  await page.goto("https://en.freqtek.com/", { waitUntil: "networkidle0" });
  await page.waitForSelector("#verifyEn");
  await page.waitForSelector("#one");
  await page.waitForSelector("#login");

  const emailInput = await page.$('[name="Username"]');
  const passwordInput = await page.$('[name="Password"]');

  if (!emailInput || !passwordInput) {
    throw new Error("Email or Password input not found");
  }

  await emailInput.type(email, { delay: 10 });
  await passwordInput.type(password, { delay: 10 });

  await page.evaluate(() => {
    const loginButton = document.querySelector("#login") as HTMLButtonElement;
    loginButton.click();
  });

  await page.waitForNavigation();
  await page.waitForSelector("#app");
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const token = await page.evaluate(() => sessionStorage.getItem("token"));
  await browser.close();

  return token;
}
