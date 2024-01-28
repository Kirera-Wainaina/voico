import { Http2ServerRequest, Http2ServerResponse } from "http2";
import { Configuration, OpenAIApi } from "openai";
const FormDataHandler = require("../lib/FormDataHandler");
import dotenv from "dotenv";
import fs from "node:fs";
import fsPromises from "node:fs/promises"

dotenv.config()

module.exports = async function(request:Http2ServerRequest, response:Http2ServerResponse) {
  try {
    const [fields, files] = await new FormDataHandler(request).run();

    if (!fields.APIKey || !fields.language) throw Error("API Key or language missing");

    const configuration = new Configuration({
      apiKey: fields.APIKey
    });
    const openai = new OpenAIApi(configuration);
  
    const openaiResponse = await openai.createTranscription(
      fs.createReadStream(files[0]),
      "whisper-1",
      undefined,
      undefined,
      undefined,
      fields.language ? fields.language : "en" // default is english language
    );
    
    await fsPromises.unlink(files[0]);
    response.writeHead(200, { 
      "content-type": "text/plain",
      "access-control-allow-origin": "*"
    });
    response.end(openaiResponse.data.text)
  } catch (error) {
    console.log(error);
    response.writeHead(500, { 
      "content-type": "text/plain",
      "access-control-allow-origin": "*"
    });
    response.end("error")
  }
}