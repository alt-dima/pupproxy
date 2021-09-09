require('dotenv').config()
const browserObject = require('./browser');
const pageScraper = require('./pageScraper');

//define a constants for browser instances
const proxies = JSON.parse(process.env.PROXIES);
const browserInstance = {};
//Start a browser instances with proxies from .env => PROXIES.
for (let proxy in proxies) {
    browserInstance[proxy] = browserObject.startBrowser(proxies[proxy]);
    //console.log(`${proxy} ${proxies[proxy]}`)
}


const net = require('net');
const server = net.createServer();

//Additional functions
function getBytes(string){
  return Buffer.byteLength(string, 'utf8')
}

//Listen for a new connections
server.on('connection', (clientToProxySocket) => {
  console.log('Client Connected To Proxy');
  // We need only the data once, the starting packet
  clientToProxySocket.once('data', async (data) => {
    // If you want to see the packet uncomment below
    console.log(data.toString());

    //check if target website is HTTPS (CONNECT method)
    let isTLSConnection = data.toString().indexOf('CONNECT') !== -1;
    
    /*
    // By Default port is 80
    let serverPort = 80;
    let serverAddress;
    if (isTLSConnection) {
      // Port changed if connection is TLS
      serverPort = data.toString()
                          .split('CONNECT ')[1].split(' ')[0].split(':')[1];;
      serverAddress = data.toString()
                          .split('CONNECT ')[1].split(' ')[0].split(':')[0];
    } else {
      serverAddress = data.toString().split('Host: ')[1].split('\r\n')[0];
    }
    */
    
      if (isTLSConnection) {
        clientToProxySocket.write('HTTP/1.1 200 OK\r\n\n');

	//TODO Magick here for https/connect requests

      } else {
	//Simple HTTP request
	//parsing url from request
	url = data.toString().split('GET ')[1].split(' HTTP')[0];
	//all the headers from request
	fullheaders = data.toString().split('\r\n');
	//deep copy from fullheaders to headers
	headers = JSON.parse(JSON.stringify(fullheaders));
	//remove from json first to headers GET/POST and Host
	headers.splice(0, 2);
	//console.log(url);
	//console.log(headers);
	//console.log(fullheaders);
	//Creating an object with url and headers for Puppeteer/Chrome
	let reqparams = {};
	reqparams.url = url;
	reqparams.headers = JSON.stringify(headers);
	//Passing reqparams to Puppeteer/Chrome and fetching response object and body
	data = await pageScraper.scraper(await browserInstance[24000], reqparams);
	//Creating a string with headers to send back to Client and filling it with headers from response from Puppeteer/Chrome
    	let wrtheaders = "";
	for (let respheader in data.response.headers()) {
	    if(respheader != "transfer-encoding") { wrtheaders += `${respheader}: ${data.response.headers()[respheader]}\r\n`; }
	}
	//I'm lasy to create
	wrtheaders += `Content-Length: ${getBytes(data.body)}\r\n`
	//console.log(wrtheaders);
	clientToProxySocket.write(`HTTP/1.1 ${data.response.status()} ${data.response.statusText()}\r\n${wrtheaders}\r\n${data.body}`);
	//console.log(data.response.headers()['x-frame-options']);

    //    clientToProxySocket.write(data.body);
    //    clientToProxySocket.write("<html>");
    }

    /*
    let proxyToServerSocket = net.createConnection({
      host: serverAddress,
      port: serverPort
    }, () => {
      console.log('PROXY TO SERVER SET UP');
      if (isTLSConnection) {
        clientToProxySocket.write('HTTP/1.1 200 OK\r\n\n');
      } else {
        proxyToServerSocket.write(data);
      }

      //clientToProxySocket.pipe(proxyToServerSocket);
      //proxyToServerSocket.pipe(clientToProxySocket);



      proxyToServerSocket.on('error', (err) => {
        console.log('PROXY TO SERVER ERROR');
        console.log(err);
      });
      
    }); */
    clientToProxySocket.on('error', err => {
      console.log('CLIENT TO PROXY ERROR');
      console.log(err);
    });
  });
});

server.on('error', (err) => {
  console.log('SERVER ERROR');
  console.log(err);
  throw err;
});

server.on('close', () => {
  console.log('Client Disconnected');
});

server.listen(process.env.EXPRESSPORT, () => {
  console.log('Server runnig at http://localhost:' + process.env.EXPRESSPORT);
});