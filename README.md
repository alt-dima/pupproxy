# Simple Demo Web Scraper/Crawling API
This "Web Scraper/Crawling API" provide a WEB-server (Express) with API to fetch a web-page using headless Chrome browser (puppeteer-extra) trought specified proxy (in the .env file).
This can be useful if you need a Javascript evalution before fetching resulting HTML (thats not possible with curl/wget)
For an every proxy app starts separate puppeteer/browser instance and opens url-request in the page/tabs in its.

How to use:
1. apt install --no-install-recommends ca-certificates fonts-liberation libappindicator3-1 libasound2 libatk-bridge2.0-0 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 lsb-release wget xdg-utils
2. npm install
3. rename .env.example to .env
4. change PROXIES and EXPRESSPORT as needed in the .env file
5. npm start
6. navigate your browser to url http://localhost:EXPRESSPORT/chrome?url=https://example.com/&proxyport=12000

To Do:
1. Add support for passing cookies
2. Add support for passing headers
3. Add support for retreiveng cookies
3. Add support for retreiveng headers
