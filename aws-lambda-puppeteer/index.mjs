import puppeteer from 'puppeteer-extra';
import chromium from '@sparticuz/chromium-min';
import core from 'puppeteer-core';
export const handler = async (event) => {
    var response = {
        statusCode: 200,
        body: JSON.stringify(event),
    };

    try {
        const browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath("https://github.com/Sparticuz/chromium/releases/download/v123.0.1/chromium-v123.0.1-pack.tar"),
            headless: chromium.headless,
        });
        const [page] = await browser.pages();
        await page.goto('https://example.com');
        const content = await page.content();
        response.body = JSON.stringify({ content });
        await browser.close();
    } catch (e) {
        response.statusCode = 500;
        response.body = JSON.stringify({ error: e.message });
    }

    return response;
};