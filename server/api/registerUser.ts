import { Http2ServerRequest, Http2ServerResponse } from "http2";
import { Firestore } from "@google-cloud/firestore";
import dotenv from "dotenv";

dotenv.config();

module.exports = function (request:Http2ServerRequest, response: Http2ServerResponse) {
  try {
    request.on('data', async data => {
      const userDetails = String(data);
      const db = new Firestore({
        projectId: "voico-extension",
        keyFilename: process.env.SERVICE_ACCOUNT_PATH
      })
      const result = await db.collection('users').add(JSON.parse(userDetails)); 
      console.log(result);
      response.writeHead(200, { "content-type": "text/plain"})
      response.end("success")
    })  
  } catch (error) {
    console.log(error);
    response.writeHead(500, { 
      "content-type": "text/plain",
      "access-control-allow-origin": "*"
    });
    response.end("error")
  }
}