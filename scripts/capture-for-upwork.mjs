import fs from 'node:fs';
import path from 'node:path';

process.env.PLAYWRIGHT_BROWSERS_PATH = path.join(process.cwd(), '.browsers');
const { chromium } = await import('@playwright/test');

const upworkDir = path.join(process.cwd(), 'upwork');
const globalUpworkDir = 'D:\\fr_sayt\\upwork';

if (!fs.existsSync(upworkDir)) fs.mkdirSync(upworkDir, { recursive: true });
if (!fs.existsSync(globalUpworkDir)) fs.mkdirSync(globalUpworkDir, { recursive: true });

const origin = 'https://fashion-shop-demo-tom.netlify.app';
const browser = await chromium.launch();

console.log('Starting Playwright screenshot capture for Upwork portfolio...');

function saveScreenshot(sourcePath, filename) {
  const dest1 = path.join(upworkDir, filename);
  const dest2 = path.join(globalUpworkDir, filename);
  fs.copyFileSync(sourcePath, dest1);
  fs.copyFileSync(sourcePath, dest2);
  console.log(`Saved: ${filename}`);
}

try {
  // 1. Storefront Desktop context
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  console.log('1. Capturing 01_storefront_home.png...');
  await page.goto(origin, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const homeShot = path.join(upworkDir, '01_storefront_home.png');
  await page.screenshot({ path: homeShot });
  saveScreenshot(homeShot, '01_storefront_home.png');

  console.log('2. Capturing 02_catalog_and_filters.png...');
  await page.goto(`${origin}/catalog`, { waitUntil: 'networkidle' });
  await page.waitForSelector('.product-card');
  await page.waitForTimeout(1000);
  const catalogShot = path.join(upworkDir, '02_catalog_and_filters.png');
  await page.screenshot({ path: catalogShot });
  saveScreenshot(catalogShot, '02_catalog_and_filters.png');

  console.log('3. Capturing 03_product_quickview.png...');
  const firstViewBtn = page.locator('.card-view').first();
  if (await firstViewBtn.isVisible()) {
    await firstViewBtn.click();
    await page.waitForSelector('dialog, .modal');
    await page.waitForTimeout(800);
    const quickShot = path.join(upworkDir, '03_product_quickview.png');
    await page.screenshot({ path: quickShot });
    saveScreenshot(quickShot, '03_product_quickview.png');
    const closeBtn = page.locator('dialog button[aria-label="Yopish"], dialog .modal-head button');
    if (await closeBtn.isVisible()) await closeBtn.click();
  }

  await context.close();

  // 2. Mobile Storefront context
  console.log('4. Capturing 04_mobile_storefront.png & 05_mobile_catalog.png...');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto(origin, { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1000);
  const mobileHomeShot = path.join(upworkDir, '04_mobile_storefront.png');
  await mobilePage.screenshot({ path: mobileHomeShot });
  saveScreenshot(mobileHomeShot, '04_mobile_storefront.png');

  await mobilePage.goto(`${origin}/catalog`, { waitUntil: 'networkidle' });
  await mobilePage.waitForSelector('.product-card');
  await mobilePage.waitForTimeout(1000);
  const mobileCatalogShot = path.join(upworkDir, '05_mobile_catalog.png');
  await mobilePage.screenshot({ path: mobileCatalogShot });
  saveScreenshot(mobileCatalogShot, '05_mobile_catalog.png');
  await mobileContext.close();

  // 3. Admin authenticated context
  console.log('Logging into Admin panel...');
  const adminContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });

  const password = fs.readFileSync('data/netlify-admin-access.txt', 'utf8').match(/Parol: (.+)/)[1].trim();
  const loginRes = await adminContext.request.post(`${origin}/api/login`, {
    headers: { origin },
    data: { username: 'owner', password },
  });
  if (!loginRes.ok()) throw new Error('Admin login failed: ' + (await loginRes.text()));

  const adminPage = await adminContext.newPage();

  console.log('5. Capturing 06_admin_dashboard.png...');
  await adminPage.goto(`${origin}/admin`, { waitUntil: 'networkidle' });
  await adminPage.waitForSelector('.stats-grid');
  await adminPage.waitForTimeout(1000);
  const dashShot = path.join(upworkDir, '06_admin_dashboard.png');
  await adminPage.screenshot({ path: dashShot });
  saveScreenshot(dashShot, '06_admin_dashboard.png');

  console.log('6. Capturing 07_admin_products_management.png...');
  await adminPage.goto(`${origin}/admin/products`, { waitUntil: 'networkidle' });
  await adminPage.waitForSelector('.admin-product-grid');
  await adminPage.waitForTimeout(1000);
  const prodShot = path.join(upworkDir, '07_admin_products_management.png');
  await adminPage.screenshot({ path: prodShot });
  saveScreenshot(prodShot, '07_admin_products_management.png');

  console.log('7. Capturing 08_admin_variant_matrix.png...');
  const editBtn = adminPage.locator('.admin-product button:has-text("Tahrirlash")').first();
  if (await editBtn.isVisible()) {
    await editBtn.click();
    await adminPage.waitForSelector('dialog, .modal');
    await adminPage.waitForTimeout(800);
    const modalShot = path.join(upworkDir, '08_admin_variant_matrix.png');
    await adminPage.screenshot({ path: modalShot });
    saveScreenshot(modalShot, '08_admin_variant_matrix.png');
    const cancelBtn = adminPage.locator('dialog button:has-text("Bekor qilish")');
    if (await cancelBtn.isVisible()) await cancelBtn.click();
  }

  console.log('8. Capturing 09_admin_inventory_and_pos.png...');
  await adminPage.goto(`${origin}/admin/inventory`, { waitUntil: 'networkidle' });
  await adminPage.waitForTimeout(1200);
  const invShot = path.join(upworkDir, '09_admin_inventory_and_pos.png');
  await adminPage.screenshot({ path: invShot });
  saveScreenshot(invShot, '09_admin_inventory_and_pos.png');

  console.log('9. Capturing 10_admin_photo_studio.png...');
  await adminPage.goto(`${origin}/admin/studio`, { waitUntil: 'networkidle' });
  await adminPage.waitForTimeout(2500);
  const studioShot = path.join(upworkDir, '10_admin_photo_studio.png');
  await adminPage.screenshot({ path: studioShot });
  saveScreenshot(studioShot, '10_admin_photo_studio.png');

  console.log('10. Capturing 11_admin_reports_analytics.png...');
  await adminPage.goto(`${origin}/admin/reports`, { waitUntil: 'networkidle' });
  await adminPage.waitForTimeout(1200);
  const reportsShot = path.join(upworkDir, '11_admin_reports_analytics.png');
  await adminPage.screenshot({ path: reportsShot });
  saveScreenshot(reportsShot, '11_admin_reports_analytics.png');

  await adminContext.close();

  // Also copy PDF presentation into upwork folder for convenient upload
  const pdfSource = path.join(process.cwd(), 'presentation', 'output', 'Fashion_Shop_Taqdimot.pdf');
  if (fs.existsSync(pdfSource)) {
    fs.copyFileSync(pdfSource, path.join(upworkDir, 'Fashion_Shop_Case_Study.pdf'));
    fs.copyFileSync(pdfSource, path.join(globalUpworkDir, 'Fashion_Shop_Case_Study.pdf'));
    console.log('Saved: Fashion_Shop_Case_Study.pdf');
  }

  console.log('=== ALL SCREENSHOTS & PRESENTATION SAVED SUCCESSFULLY ===');
} finally {
  await browser.close();
}
