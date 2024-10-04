import puppeteer from "puppeteer";

export async function getBearerToken() {
  const browser = await puppeteer.launch({ headless: true });
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

  await emailInput.type("lab3d.fortaleza@gmail.com", { delay: 10 });
  await passwordInput.type("Bucal1234", { delay: 10 });

  await page.evaluate(() => {
    const loginButton = document.querySelector("#login") as HTMLButtonElement;
    loginButton.click();
  });

  await page.waitForNavigation();
  await page.waitForSelector("#app");
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const token = await page.evaluate(() => sessionStorage.getItem("token"));
  await browser.close();

  console.log("finish scrapping");

  return token;
}
