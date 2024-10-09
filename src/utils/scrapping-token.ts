import chromium from 'chrome-aws-lambda';
import puppeteer, { Browser } from 'puppeteer-core';

export async function getBearerToken() {
  let browser: Browser | null = null;

  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();

    await page.goto('https://en.freqtek.com/', { waitUntil: 'networkidle0' });

    await page.waitForSelector('#verifyEn');
    await page.waitForSelector('#one');
    await page.waitForSelector('#login');

    const emailInput = await page.$('[name="Username"]');
    const passwordInput = await page.$('[name="Password"]');

    if (!emailInput || !passwordInput) {
      throw new Error('Email or Password input not found');
    }

    await emailInput.type('lab3d.fortaleza@gmail.com', { delay: 10 });
    await passwordInput.type('Bucal1234', { delay: 10 });

    await page.evaluate(() => {
      const loginButton = document.querySelector('#login') as HTMLButtonElement;
      loginButton.click();
    });

    await page.waitForNavigation();
    await page.waitForSelector('#app');

    await new Promise(resolve => setTimeout(resolve, 1000));

    const token = await page.evaluate(() => sessionStorage.getItem('token'));

    console.log('Scraping finalizado com sucesso.');

    return token;
  } catch (error) {
    console.error('Erro ao executar o scraping:', error);
    throw error;
  } finally {
    if (browser !== null) await browser.close();
  }
}
