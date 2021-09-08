# Simple Demo Web Scraper/Crawling API
This "Web Scraper/Crawling API" provide a WEB-server (Express) with API to fetch a web-page using headless Chrome browser (puppeteer-extra) trought specified proxy (in the .env file).
This can be useful if you need a Javascript evalution before fetching resulting HTML (thats not possible with curl/wget)
For an every proxy app starts separate puppeteer/browser instance and opens url-request in the page/tabs in its.

How to use:
1. apt install --no-install-recommends ca-certificates fonts-liberation libappindicator3-1 libasound2 libatk-bridge2.0-0 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 lsb-release wget xdg-utils
1. npm install
1. rename .env.example to .env
1. change PROXIES and EXPRESSPORT as needed in the .env file
1. npm start
1. navigate your browser to url http://localhost:EXPRESSPORT/chrome?url=http://leserged.online.fr/phpinfo.php&proxyport=12000&headers=%7B%22Header1%22%3A+%22HeaderValue1%22%2C%22Header2%22%3A+%22HeaderValue2%22%7D&cookies=%7B%22Cookie1%22%3A+%22CookieVal1%22%2C%22Cookie2%22%3A+%22CookieVal2%22%7D

To Do:
- [x] Add support for passing cookies = specify cookies in JSON in the **cookies** GET-parameter
- [x] Add support for passing headers = specify headers in JSON in the **headers** GET-parameter
- [ ] Add support for retreiveng cookies
- [ ] Add support for retreiveng headers

Thanks to https://www.digitalocean.com/community/tutorials/how-to-scrape-a-website-using-node-js-and-puppeteer

![pupproxy](https://user-images.githubusercontent.com/59618193/132549416-c3e3b7dd-a060-4759-bffc-e302b5e76a34.png)