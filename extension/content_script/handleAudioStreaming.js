var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var mediaRecorder = null;
chrome.runtime.onMessage.addListener(handleMessagesOnStreaming);
function handleMessagesOnStreaming(message) {
    // don't run anything if streaming is off
    if (message.content && !message.content.enabledStreaming)
        return;
    if (message.name == "record_click") {
        handleStreaming(message.content);
    }
}
function handleStreaming(content) {
    return __awaiter(this, void 0, void 0, function () {
        var stream, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    if (!!content.user_media_is_setup) return [3 /*break*/, 2];
                    return [4 /*yield*/, navigator.mediaDevices.getUserMedia({ audio: true })];
                case 1:
                    stream = _a.sent();
                    if (stream) {
                        chrome.runtime.sendMessage({ name: "permission_granted" });
                        mediaRecorder = new MediaRecorder(stream);
                        mediaRecorder.addEventListener('dataavailable', sendAudioChunks);
                        mediaRecorder.start(4000);
                    }
                    return [3 /*break*/, 3];
                case 2:
                    if (!content.recording) {
                        mediaRecorder === null || mediaRecorder === void 0 ? void 0 : mediaRecorder.start(4000);
                    }
                    else {
                        mediaRecorder === null || mediaRecorder === void 0 ? void 0 : mediaRecorder.stop();
                    }
                    _a.label = 3;
                case 3: return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.log(error_1);
                    // user denied permission
                    chrome.runtime.sendMessage({ name: "permission_denied" });
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function sendAudioChunks(chunk) {
    var websocket = new WebSocket('ws://127.0.0.1');
    websocket.send(chunk.data);
}
function handleStreaming_(content) {
    return __awaiter(this, void 0, void 0, function () {
        var stream_1, peerConnection_1, sessionDescription, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    if (!!content.user_media_is_setup) return [3 /*break*/, 5];
                    return [4 /*yield*/, navigator.mediaDevices.getUserMedia({ audio: true })];
                case 1:
                    stream_1 = _a.sent();
                    if (!stream_1) return [3 /*break*/, 4];
                    // console.log(content)
                    chrome.runtime.sendMessage({ name: "permission_granted" });
                    peerConnection_1 = new RTCPeerConnection();
                    // const rtcSender = peerConnection.addTrack(stream.getAudioTracks()[0]);
                    stream_1.getAudioTracks().forEach(function (track) { return peerConnection_1.addTrack(track, stream_1); });
                    return [4 /*yield*/, peerConnection_1.createOffer()];
                case 2:
                    sessionDescription = _a.sent();
                    console.log(sessionDescription);
                    return [4 /*yield*/, peerConnection_1.setLocalDescription(sessionDescription)];
                case 3:
                    _a.sent();
                    // peerConnection.createDataChannel('food')
                    console.log("ran up to this point");
                    _a.label = 4;
                case 4: return [3 /*break*/, 5];
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_2 = _a.sent();
                    console.log(error_2);
                    // user denied permission
                    chrome.runtime.sendMessage({ name: "permission_denied" });
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
