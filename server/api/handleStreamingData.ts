const { SpeechClient } = require('@google-cloud/speech');
const { log } = require('../lib/utils')
import { Readable } from "stream";

export default function (request: any) {
  const connection = request.accept('echo-protocol', request.origin);
  const speechClient = new SpeechClient({
    projectId: process.env.PROJECT_ID,
    keyFilename: process.env.SERVICE_ACCOUNT_PATH
  });

  const streamingRequest = {
    config: {
      encoding: 'WEBM_OPUS',
      sampleRateHertz: 16000,
      languageCode: 'en-US',
    },
  };

  const recognizeStream = speechClient.streamingRecognize(streamingRequest)
     .on('data', (data: any) => {
      connection.sendUTF(data.results[0].alternatives[0].transcript)
     })
     .on('error', console.log)
  
  connection.on('message', (message: {type: string, binaryData: Buffer}) => {
    Readable.from(message.binaryData).pipe(recognizeStream, {end: false})
  })

  connection.on('close', () => {
    // console.log('close connection')
    log('Socket connection closed')
    recognizeStream.end()
  })
}