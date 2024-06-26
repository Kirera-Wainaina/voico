/*
 * this is where audio is recorded and transmitted to the server
*/
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
chrome.runtime.onMessage.addListener(handleMessagesOnRecording);
function handleMessagesOnRecording(message) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // don't run this script if streaming is enabled
                    if (message.content && message.content.enabledStreaming)
                        return [2 /*return*/];
                    if (!(message.name == "record_click")) return [3 /*break*/, 2];
                    return [4 /*yield*/, handleRecording(message.content)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
function handleRecording(content) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(!content.user_media_is_setup && content.recordingLanguage && content.APIKey)) return [3 /*break*/, 2];
                    return [4 /*yield*/, setupRecording(content.recordingLanguage, content.APIKey)];
                case 1:
                    result = _a.sent();
                    if (result) {
                        mediaRecorder = result;
                        mediaRecorder.start();
                    }
                    return [3 /*break*/, 3];
                case 2:
                    if (!content.recording) {
                        mediaRecorder === null || mediaRecorder === void 0 ? void 0 : mediaRecorder.start();
                    }
                    else {
                        mediaRecorder === null || mediaRecorder === void 0 ? void 0 : mediaRecorder.stop();
                    }
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function setupRecording(recordingLanguage, APIKey) {
    return __awaiter(this, void 0, void 0, function () {
        var stream, audioData_1, mediaRecorder_1, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, navigator.mediaDevices.getUserMedia({ audio: true })];
                case 1:
                    stream = _a.sent();
                    if (stream) {
                        chrome.runtime.sendMessage({ name: "permission_granted" });
                        audioData_1 = [];
                        mediaRecorder_1 = new MediaRecorder(stream);
                        mediaRecorder_1.addEventListener("stop", function () { return transmitAudio(audioData_1, recordingLanguage, APIKey); });
                        mediaRecorder_1.addEventListener("dataavailable", function (event) { return combineAudioData(event, audioData_1); });
                        return [2 /*return*/, mediaRecorder_1];
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
function combineAudioData(event, audioDataArray) {
    // remove the current blob in the array
    audioDataArray.pop();
    // enter the new blob. Only one blob will be in the array
    audioDataArray.push(event.data);
}
function transmitAudio(audioData, recordingLanguage, APIKey) {
    return __awaiter(this, void 0, void 0, function () {
        var blob, formdata, envUrl, env;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    blob = new Blob(audioData, { type: "audio/webm;codecs=opus" });
                    formdata = new FormData();
                    formdata.append("audio", blob);
                    formdata.append("fileNumber", "1");
                    formdata.append("language", recordingLanguage);
                    formdata.append("APIKey", APIKey);
                    envUrl = chrome.runtime.getURL("/env.js");
                    return [4 /*yield*/, import(envUrl)];
                case 1:
                    env = _a.sent();
                    // use 'cors' because the request isn't going to same origin
                    // the server has allowed access through "access-control-allow-origin" header
                    fetch("".concat(env.default.domain, "/api/transcribe"), {
                        method: "POST",
                        body: formdata,
                        mode: "cors"
                    })
                        .then(function (response) {
                        if (response.status == 500)
                            throw new Error("server error");
                        return response.text();
                    })
                        .then(function (text) {
                        chrome.runtime.sendMessage({ name: "transcript_received", content: text });
                        inputTextIntoActiveElement(text);
                    })
                        .catch(function (error) {
                        // let the user know there is an error through the popup
                        chrome.runtime.sendMessage({ name: "server_error" });
                    });
                    return [2 /*return*/];
            }
        });
    });
}
function inputTextIntoActiveElement(text) {
    var activeElement = document.activeElement;
    if (activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement) {
        if (!activeElement.value) {
            activeElement.value = text;
        }
        else {
            // start new paragraph
            activeElement.value += "\n".concat(text);
        }
    }
    else if (activeElement instanceof HTMLDivElement &&
        activeElement.hasAttribute("contenteditable")) {
        if (!activeElement.innerText) {
            activeElement.innerText = text;
        }
        else {
            // start new paragraph
            activeElement.innerText += "\n".concat(text);
        }
    }
}
