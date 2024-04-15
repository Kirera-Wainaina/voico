"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { SpeechClient } = require('@google-cloud/speech');
const { log } = require('../lib/utils');
const stream_1 = require("stream");
function default_1(request) {
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
        .on('data', (data) => {
        connection.sendUTF(data.results[0].alternatives[0].transcript);
    })
        .on('error', console.log);
    connection.on('message', (message) => {
        if (message.type == 'utf8' && message.utf8Data) {
            streamingRequest.config.languageCode = message.utf8Data;
        }
        else if (message.binaryData) {
            stream_1.Readable.from(message.binaryData).pipe(recognizeStream, { end: false });
        }
    });
    connection.on('close', () => {
        // console.log('close connection')
        log('Socket connection closed');
        recognizeStream.end();
    });
}
exports.default = default_1;
