const scraperObject = {
    async scraper(browser, params){

	//create a new page/tab in browser
        let page = await browser.newPage();
	//await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36')

	//navigate page/tab to specified url
        //console.log(`Navigating to ${params.url}...`);
        await page.goto(params.url, { waitUntil: 'load' });
	
	//get full page html with evaluting JS on it
	let data;
	data = await page.evaluate(() => document.querySelector('*').outerHTML);
	
	//close page/tab on browser
	await page.close();

	//return page html to express webserver
	return data;
    }
}

module.exports = scraperObject;