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
var webSocket = null;
chrome.runtime.onMessage.addListener(handleMessagesOnStreaming);
function handleMessagesOnStreaming(message) {
    // don't run anything if streaming is off
    if (message.content && !message.content.enabledStreaming)
        return;
    if (message.name == "record_click") { // user clicked to start/stop recording
        handleStreaming(message.content);
    }
}
function handleStreaming(content) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (content.recording) {
                mediaRecorder === null || mediaRecorder === void 0 ? void 0 : mediaRecorder.stop();
                webSocket === null || webSocket === void 0 ? void 0 : webSocket.close();
                webSocket = null;
            }
            else {
                setupWebSocket();
            }
            return [2 /*return*/];
        });
    });
}
function setupWebSocket() {
    return __awaiter(this, void 0, void 0, function () {
        var envUrl, env;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    envUrl = chrome.runtime.getURL("/env.js");
                    return [4 /*yield*/, import(envUrl)];
                case 1:
                    env = _a.sent();
                    if (!webSocket) {
                        webSocket = new WebSocket("".concat(env.default.webSocketURL), ['echo-protocol']);
                    }
                    webSocket.onopen = function (event) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    console.log('websocket open');
                                    // start recording once web socket is open
                                    return [4 /*yield*/, startRecording()];
                                case 1:
                                    // start recording once web socket is open
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    webSocket.onmessage = function (event) {
                        // console.log(event.data);
                        inputTextStreamIntoActiveElement(event.data);
                    };
                    return [2 /*return*/];
            }
        });
    });
}
function startRecording() {
    return __awaiter(this, void 0, void 0, function () {
        var stream, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, navigator.mediaDevices.getUserMedia({ audio: true })];
                case 1:
                    stream = _a.sent();
                    if (stream) {
                        chrome.runtime.sendMessage({ name: "permission_granted" });
                        mediaRecorder = new MediaRecorder(stream);
                        // send data to the server
                        mediaRecorder.addEventListener('dataavailable', function (event) {
                            if ((webSocket === null || webSocket === void 0 ? void 0 : webSocket.readyState) != 2 && (webSocket === null || webSocket === void 0 ? void 0 : webSocket.readyState) != 3) {
                                webSocket === null || webSocket === void 0 ? void 0 : webSocket.send(new Blob([event.data], { type: "audio/webm;codecs=opus" }));
                            }
                        });
                        mediaRecorder.start(2000);
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    // user denied permission
                    chrome.runtime.sendMessage({ name: "permission_denied" });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function inputTextStreamIntoActiveElement(text) {
    var activeElement = document.activeElement;
    if ( // check for elements that are editable
    activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement) {
        if (!activeElement.value) {
            activeElement.value = text;
        }
        else {
            activeElement.value += text;
        }
    }
    else if (activeElement instanceof HTMLDivElement &&
        activeElement.hasAttribute('contenteditable')) {
        if (!activeElement.innerText) {
            activeElement.innerText = text;
        }
        else {
            activeElement.innerText += text;
        }
    }
}
