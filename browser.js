//include puppeteer-extra with stealth plugin
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

async function startBrowser(proxy){
    let browser;
    try {
        console.log(`Opening the browser with proxy ${proxy}......`);
        browser = await puppeteer.launch({
            headless: true,
            args: [`--proxy-server=${proxy}`],
            'ignoreHTTPSErrors': false
        });
    } catch (err) {
        console.log("Could not create a browser instance => : ", err);
    }
    return browser;
}

module.exports = {
    startBrowser
};