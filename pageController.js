const pageScraper = require('./pageScraper');
async function scrapeAll(browserInstance, url){
    let browser;
    let bodyhtml;
    try{
        browser = await browserInstance;
        bodyhtml = await pageScraper.scraper(browser, url);

    }
    catch(err){
        console.log("Could not resolve the browser instance => ", err);
    }
    return bodyhtml;
}

module.exports = (browserInstance, url) => scrapeAll(browserInstance, url)