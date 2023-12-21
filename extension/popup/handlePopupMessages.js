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
import Toggle from "./Toggle.js";
import changeRecordingState from "./changeRecordingState.js";
import enterTranscriptIntoTranscriptElement from "./enterTranscriptIntoTranscriptElement.js";
import showNotification from "./showNotification.js";
export default function (message) {
    switch (message.name) {
        case "transcript_received":
            Toggle.loadingIcon();
            saveTranscript(message.content);
            break;
        case "permission_denied":
            handlePermissionDenied();
            break;
        case "permission_granted":
            handlePermissionGranted();
            break;
        case "server_error":
            var errorNotification = document.getElementById("server-error");
            if (errorNotification)
                showNotification(errorNotification);
            Toggle.loadingIcon();
            break;
        case "is_online":
            handleWifiSituation(message.content);
        default:
            break;
    }
}
function saveTranscript(text) {
    return __awaiter(this, void 0, void 0, function () {
        var transcripts;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, chrome.storage.local.get("transcripts")];
                case 1:
                    transcripts = (_a.sent()).transcripts;
                    if (transcripts) {
                        transcripts = JSON.parse(transcripts);
                        if (transcripts.length >= 5) {
                            // maintain the saved transcripts at 5 or below
                            // anything above is popped
                            transcripts.pop();
                        }
                    }
                    else {
                        transcripts = [];
                    }
                    transcripts.unshift(text);
                    return [4 /*yield*/, chrome.storage.local.set({ "transcripts": JSON.stringify(transcripts) })];
                case 2:
                    _a.sent();
                    enterTranscriptIntoTranscriptElement();
                    return [2 /*return*/];
            }
        });
    });
}
function handlePermissionDenied() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // restore state
                return [4 /*yield*/, chrome.storage.session.set({
                        "user_media_is_setup": false,
                        "recording": false,
                        "permission_granted": false
                    })
                    // show the permission note
                ];
                case 1:
                    // restore state
                    _a.sent();
                    // show the permission note
                    Toggle.permissionNote();
                    return [2 /*return*/];
            }
        });
    });
}
function handlePermissionGranted() {
    return __awaiter(this, void 0, void 0, function () {
        var permission_granted;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, chrome.storage.session.get("permission_granted")];
                case 1:
                    permission_granted = (_a.sent()).permission_granted;
                    // if permission was set, nothing to do
                    if (permission_granted)
                        return [2 /*return*/];
                    return [4 /*yield*/, chrome.storage.session.set({ "permission_granted": true })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, changeRecordingState()];
                case 3:
                    _a.sent();
                    Toggle.recordingAnimation();
                    Toggle.hint();
                    return [2 /*return*/];
            }
        });
    });
}
function handleWifiSituation(status) {
    if (status)
        return; // do nothing if there is wifi
    // show the no wifi icon
    Toggle.elementDisplay("no-wifi-icon");
    // hide the record button and hint
    Toggle.elementDisplay("mic");
    Toggle.elementDisplay("hint");
}
