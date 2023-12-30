const puppeteer = require('puppeteer-extra')

const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())


puppeteer.launch({ headless: false }).then(async browser => {
  const page = await browser.newPage()
  const pages = await browser.pages()
  const p1 = pages[0]
  await p1.goto('<url>')
  await page.goto('<url>')
  


})