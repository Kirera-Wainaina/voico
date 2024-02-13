"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const openai_1 = require("openai");
const FormDataHandler = require("../lib/FormDataHandler");
const dotenv_1 = __importDefault(require("dotenv"));
const node_fs_1 = __importDefault(require("node:fs"));
const promises_1 = __importDefault(require("node:fs/promises"));
dotenv_1.default.config();
module.exports = async function (request, response) {
    try {
        const [fields, files] = await new FormDataHandler(request).run();
        if (!fields.APIKey || !fields.language)
            throw Error("API Key or language missing");
        const configuration = new openai_1.Configuration({
            apiKey: fields.APIKey
        });
        const openai = new openai_1.OpenAIApi(configuration);
        const openaiResponse = await openai.createTranscription(node_fs_1.default.createReadStream(files[0]), "whisper-1", undefined, undefined, undefined, fields.language ? fields.language : "en" // default is english language
        );
        await promises_1.default.unlink(files[0]);
        response.writeHead(200, {
            "content-type": "text/plain",
            "access-control-allow-origin": "*"
        });
        response.end(openaiResponse.data.text);
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
