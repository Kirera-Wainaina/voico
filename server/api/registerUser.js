"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firestore_1 = require("@google-cloud/firestore");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
module.exports = function (request, response) {
    try {
        request.on('data', async (data) => {
            const userDetails = String(data);
            const db = new firestore_1.Firestore({
                projectId: process.env.PROJECT_ID,
                keyFilename: process.env.SERVICE_ACCOUNT_PATH
            });
            const result = await db.collection('users').add(JSON.parse(userDetails));
            console.log(result);
            response.writeHead(200, { "content-type": "text/plain" });
            response.end("success");
        });
    }
    catch (error) {
        console.log(error);
        response.writeHead(500, {
            "content-type": "text/plain",
            "access-control-allow-origin": "*"
        });
        response.end("error");
    }
};
