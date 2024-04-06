import { IncomingMessage, ServerResponse } from "http";
import { Http2ServerRequest, Http2ServerResponse } from "http2";

const http = require("http");
const http2 = require("http2");
// const fs = require('node:fs')
const dotenv = require("dotenv");
const { log } = require("./lib/utils");
const mimes = require("./lib/MIMEHandler");
import path from "path";
import fs from "node:fs";
import zlib from "node:zlib";
import net from "node:net";

const HTTP_PORT = 80;
const HTTP2_PORT = 443;

dotenv.config()

///////////////////////// REDIRECT HTTP REQUESTS /////////////////////////////////

// const httpServer = http.createServer();

// httpServer.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}`));

// httpServer.on("request", (request: IncomingMessage, response: ServerResponse) => {
//   response.writeHead(301, {
//     "location": `${process.env.DOMAIN}${request.url}`
//   })
//   response.end()
// })

//////////////////////// HANDLE HTTPS REQUESTS ///////////////////////////////////
let options;
if (process.env.CERT_KEY_PATH
    && process.env.CERT_CERTIFICATE_PATH) {
  options = {
    allowHTTP1: true,
    key: fs.readFileSync(process.env.CERT_KEY_PATH),
    cert: fs.readFileSync(process.env.CERT_CERTIFICATE_PATH)
  };
  
}

// const http2Server = http2.createSecureServer(options);

// http2Server.listen(HTTP2_PORT, () => console.log(`Listening on port ${HTTP2_PORT}`))

// http2Server.on("request", (request: Http2ServerRequest, response: Http2ServerResponse) => {
//   if (request.headers[":method"] == "GET") {
//     handleGETRequests(request, response);
//   } else if (request.headers[":method"] == "POST") {
//     handlePOSTRequests(request, response);
//   }
// })

// http2Server.on("request", (request: Http2ServerRequest) => log(`Path: ${request.url}`))

function handleGETRequests(request:Http2ServerRequest, response: Http2ServerResponse) {
  const filePath = createFilePath(request.headers[":path"]);

  if (!filePath) {
    sendPageNotFoundErrorResponse(response);
    return
  }
  sendPageResponse(response, filePath);
}

function handlePOSTRequests(request:Http2ServerRequest, response:Http2ServerResponse) {
  const requestPath = request.headers[":path"];

  if (requestPath) {
    const parsedUrl = new URL(requestPath, process.env.DOMAIN);
    const main = require(`.${parsedUrl.pathname}.js`);
    main(request, response);
  }
}

function createFilePath(requestPath:string | undefined) {
  if (!requestPath) return ;

  const parsedUrl = new URL(requestPath, process.env.DOMAIN);
  if (parsedUrl.pathname == '/') {
    return path.join(__dirname, `/frontend/html/home.html`)
  } else if (!path.extname(parsedUrl.pathname)) {
    // there is no extension therefore a browser path
    return path.join(__dirname, `/frontend/html${parsedUrl.pathname}.html`);
  } else {
    // all other filepaths
    return path.join(__dirname, parsedUrl.pathname);
  }
}

function sendPageNotFoundErrorResponse(response:Http2ServerResponse) {
  response.writeHead(404, {"content-type": "text/html"})
  response.end("<h1>Couldn't Find Page you are looking for</h1>")
}

async function sendPageResponse(response:Http2ServerResponse, filePath: string) {
  const existing = await isExistingFile(filePath);
  const mimeType:string = mimes.findMIMETypeFromExtension(path.extname(filePath));

  if (!existing) {
    sendPageNotFoundErrorResponse(response);
    return
  }

  response.writeHead(
    200,
    {
      'content-type': mimeType,
      'content-encoding': mimeType.includes("image") ? '' : "gzip",
      'cache-control': 'max-age=1209600'
    }
  )
  if (mimeType.includes("image")) {
    // images shouldn't be compressed
    fs.createReadStream(filePath)
      .pipe(response);
      return
  }
  fs.createReadStream(filePath)
    .pipe(zlib.createGzip())
    .pipe(response)
}

function isExistingFile(filePath:string){
  return new Promise((resolve, reject) => {
      fs.access(filePath, (error) => {
          if (error) {
              resolve(false)
          } else {
              resolve(true)
          }
      })
  })
}

process.on("uncaughtException", error => {
  // log the error and prevent crashing
  console.log(error);
})

////////////// Streaming Server /////////////////////

const streamingServer = net.createServer();

streamingServer.listen(8080, () => console.log("Listening for socket connections"))

streamingServer.on('connection', socket => {
  console.log('A connection was attempted');

  socket.on('data', data => {
    console.log('\nData was received \n')
    console.log(String(data))
    // socket.write("hello world")
  });

  socket.on('end', () => {
    socket.write('hello', (error) => {
      if (error) console.log(error)
      console.log('finished sending')
    })
  })

  socket.write('hello')
  console.log(socket.readyState)
})