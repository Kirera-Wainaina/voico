"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const http2 = require("http2");
const dotenv = require("dotenv");
const WebSocketServer = require("websocket").server;
const { log } = require("./lib/utils");
const mimes = require("./lib/MIMEHandler");
const path_1 = __importDefault(require("path"));
const node_fs_1 = __importDefault(require("node:fs"));
const node_zlib_1 = __importDefault(require("node:zlib"));
const HTTP_PORT = 80;
const HTTP2_PORT = 443;
dotenv.config();
///////////////////////// REDIRECT HTTP REQUESTS /////////////////////////////////
const httpServer = http.createServer();
httpServer.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}`));
httpServer.on("request", (request, response) => {
    // response.writeHead(301, {
    //   "location": `${process.env.DOMAIN}${request.url}`
    // })
    response.writeHead(404);
    response.end();
});
//////////////////////// HANDLE HTTPS REQUESTS ///////////////////////////////////
let options;
if (process.env.CERT_KEY_PATH
    && process.env.CERT_CERTIFICATE_PATH) {
    options = {
        allowHTTP1: true,
        key: node_fs_1.default.readFileSync(process.env.CERT_KEY_PATH),
        cert: node_fs_1.default.readFileSync(process.env.CERT_CERTIFICATE_PATH)
    };
}
const http2Server = http2.createSecureServer(options);
http2Server.listen(HTTP2_PORT, () => console.log(`Listening on port ${HTTP2_PORT}`));
http2Server.on("request", (request, response) => {
    if (request.headers[":method"] == "GET") {
        handleGETRequests(request, response);
    }
    else if (request.headers[":method"] == "POST") {
        handlePOSTRequests(request, response);
    }
});
http2Server.on("request", (request) => log(`Path: ${request.url}`));
function handleGETRequests(request, response) {
    const filePath = createFilePath(request.headers[":path"]);
    if (!filePath) {
        sendPageNotFoundErrorResponse(response);
        return;
    }
    sendPageResponse(response, filePath);
}
function handlePOSTRequests(request, response) {
    const requestPath = request.headers[":path"];
    if (requestPath) {
        const parsedUrl = new URL(requestPath, process.env.DOMAIN);
        const main = require(`.${parsedUrl.pathname}.js`);
        main(request, response);
    }
}
function createFilePath(requestPath) {
    if (!requestPath)
        return;
    const parsedUrl = new URL(requestPath, process.env.DOMAIN);
    if (parsedUrl.pathname == '/') {
        return path_1.default.join(__dirname, `/frontend/html/home.html`);
    }
    else if (!path_1.default.extname(parsedUrl.pathname)) {
        // there is no extension therefore a browser path
        return path_1.default.join(__dirname, `/frontend/html${parsedUrl.pathname}.html`);
    }
    else {
        // all other filepaths
        return path_1.default.join(__dirname, parsedUrl.pathname);
    }
}
function sendPageNotFoundErrorResponse(response) {
    response.writeHead(404, { "content-type": "text/html" });
    response.end("<h1>Couldn't Find Page you are looking for</h1>");
}
async function sendPageResponse(response, filePath) {
    const existing = await isExistingFile(filePath);
    const mimeType = mimes.findMIMETypeFromExtension(path_1.default.extname(filePath));
    if (!existing) {
        sendPageNotFoundErrorResponse(response);
        return;
    }
    response.writeHead(200, {
        'content-type': mimeType,
        'content-encoding': mimeType.includes("image") ? '' : "gzip",
        'cache-control': 'max-age=1209600'
    });
    if (mimeType.includes("image")) {
        // images shouldn't be compressed
        node_fs_1.default.createReadStream(filePath)
            .pipe(response);
        return;
    }
    node_fs_1.default.createReadStream(filePath)
        .pipe(node_zlib_1.default.createGzip())
        .pipe(response);
}
function isExistingFile(filePath) {
    return new Promise((resolve, reject) => {
        node_fs_1.default.access(filePath, (error) => {
            if (error) {
                resolve(false);
            }
            else {
                resolve(true);
            }
        });
    });
}
process.on("uncaughtException", error => {
    // log the error and prevent crashing
    console.log(error);
});
////////////// Streaming Server /////////////////////
const webSocketServer = new WebSocketServer({
    httpServer
});
webSocketServer.on("request", (request) => {
    const connection = request.accept('echo-protocol', request.origin);
    connection.on('message', console.log);
    connection.on('close', () => console.log('close connection'));
});
