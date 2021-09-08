//include nesessary modules
const express = require('express')
const webserv = express()
require('dotenv').config()
const browserObject = require('./browser');
const pageScraper = require('./pageScraper');

//define a constants for browser instances
const proxies = JSON.parse(process.env.PROXIES);
const browserInstance = {};
//Start a browser instances with proxies from .env => PROXIES 
for (let proxy in proxies) {
    browserInstance[proxy] = browserObject.startBrowser(proxies[proxy]);
    //console.log(`${proxy} ${proxies[proxy]}`)
}

//Express event handler on GET /chrome with required params:
//url = URL to fetch in the Browser
//proxyport = valid proxyport from the .env => PROXIES
//Not required params:
//headers = headers to pass with a request in a browser
//cookies = to pass a cookies
webserv.get('/chrome',  async (req, res) => {
  if (!req.query.url || !(req.query.proxyport in browserInstance)) res.status(400).send('Missing params');
  else {
    // Pass the browser instance to the scraper controller with a params from query
    bodyht = await pageScraper.scraper(await browserInstance[req.query.proxyport], req.query);
    res.send(bodyht);
  }
})

//Start an Express WEB-server on port from ,env => EXPRESSPORT
webserv.listen(process.env.EXPRESSPORT, function () { console.log(`started express on port ${process.env.EXPRESSPORT}`);});

//Do we need to close browser instances on app termination?
//browserInstance.close()
