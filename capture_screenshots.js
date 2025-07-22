import puppeteer from 'puppeteer';
import fs from 'fs';

async function captureScreenshots() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: '/nix/store/zi4f80l169xlmivz8vja8wlphq74qqk0-chromium-125.0.6422.141/bin/chromium',
    args: [
      '--no-sandbox', 
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
      '--disable-gpu'
    ]
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });
  
  const baseUrl = 'http://localhost:5000';
  const pages = [
    { name: 'dashboard', path: '/' },
    { name: 'database', path: '/database' },
    { name: 'graphql', path: '/graphql' },
    { name: 'auth', path: '/auth' },
    { name: 'storage', path: '/storage' },
    { name: 'functions', path: '/functions' },
    { name: 'ai', path: '/ai' },
    { name: 'playground', path: '/playground' }
  ];
  
  console.log('Capturing screenshots...');
  
  for (const pageDef of pages) {
    try {
      console.log(`Capturing ${pageDef.name}...`);
      await page.goto(`${baseUrl}${pageDef.path}`, { waitUntil: 'networkidle0' });
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for animations
      await page.screenshot({ 
        path: `screenshots/${pageDef.name}.png`,
        fullPage: false
      });
    } catch (error) {
      console.error(`Error capturing ${pageDef.name}:`, error.message);
    }
  }
  
  await browser.close();
  console.log('Screenshots captured!');
}

captureScreenshots().catch(console.error);