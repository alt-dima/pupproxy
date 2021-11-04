const scraperObject = {
    async scraper(browser, params){

        //create a new page/tab in browser
        let page = await browser.newPage();
        //await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36')

        //passing cookies to the page
        if(params.cookies) {
            //console.log(JSON.parse(params.cookies));
            cookies = JSON.parse(params.cookies)
            for (cooka in cookies) {
                await page.setCookie({"name": cooka, "value":cookies[cooka], "url":params.url});
            }
        }

        //passing headers to the page
        //let headers = params.headers;
        //console.log(params.headers);
        if(params.headers) { await page.setExtraHTTPHeaders(JSON.parse(params.headers)); }
        if(params.agent) { await page.setUserAgent(params.agent); }


        //navigate page/tab to specified url
        let data = {};
        //console.log(`Navigating to ${params.url}...`);
        data.response = await page.goto(params.url, { waitUntil: 'load' });

        //get full page html with evaluting JS on it
        data.body = await page.evaluate(() => document.querySelector('*').outerHTML);

        //close page/tab on browser
        await page.close();

        //return page html to express webserver
        return data;
    }
}

module.exports = scraperObject;