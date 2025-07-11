import { Credentials } from "@/@types";
import logger from "@/utils/logger";
import { chromium } from "playwright";

export async function scrapPandaToken({ email, password }: Pick<Credentials, 'email' | 'password'>, isHeadless: boolean = false): Promise<string | null> {
  logger.debug('start scrapping panda token with playwright. Headless mode: ' + isHeadless);

  const browser = await chromium.launch({ 
    headless: isHeadless,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--disable-extensions',
      '--disable-plugins',
      '--disable-images',
      '--disable-javascript-harmony-shipping',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding',
      '--disable-features=TranslateUI,VizDisplayCompositor'
    ]
  });
  
  const context = await browser.newContext({
    // Disable images and CSS for faster loading
    ignoreHTTPSErrors: true,
    // Reduce viewport size for faster rendering
    viewport: { width: 1280, height: 720 }
  });

  // Block unnecessary resources
  await context.route('**/*', (route) => {
    const resourceType = route.request().resourceType();
    if (['image', 'font', 'media'].includes(resourceType)) {
      route.abort();
    } else {
      route.continue();
    }
  });
  const page = await context.newPage();

  /* 
   * Login stage
   */
  // navigate to login page
  await page.goto('https://en.freqtek.com/');

  // wait for the login page to load
  await page.waitForURL('**/login.html**', { timeout: 30000 });
  // wait for network to be idle (no requests for 500ms)
  await page.waitForLoadState('networkidle');

  logger.debug('at login page, filling credentials...');

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
  await page.waitForURL('**/home**', { timeout: 30000 });
  logger.debug('logged in, extracting token...');

  const token = await page.evaluate(() => {
    return sessionStorage.getItem('token') || null;
  });

  await browser.close();

  return token;
}
