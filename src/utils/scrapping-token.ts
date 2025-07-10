import { Credentials } from "@/@types";
import { chromium } from "playwright";

export async function scrappingPandaToken({ email, password }: Credentials) {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  /* 
   * Login stage
   */
  // navigate to login page
  await page.goto('https://en.freqtek.com/');

  // wait for the login page to load
  await page.waitForURL('**/login.html**', { timeout: 10000 });
  // wait for network to be idle (no requests for 500ms)
  await page.waitForLoadState('networkidle');

  // wait for login form elements to be available
  await page.waitForSelector('#username');
  await page.waitForSelector('#password');
  await page.waitForSelector('.login');

  // fill in the credentials
  await page.fill('#username', email);
  await page.fill('#password', password);

  // click the login button twice
  await page.click('.login');
  await page.click('.login');

  /* 
   * Token extraction stage
   */
  // wait for the page to navigate to /home after login
  await page.waitForURL('**/home**', { timeout: 10000 });

  const token = await page.evaluate(() => {
    return sessionStorage.getItem('token') || null;
  });

  await browser.close();

  return token;
}
