var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
import copyTranscriptToClipboard from "./copyTranscriptToClipboard.js";
import enterTranscriptIntoTranscriptElement from "./enterTranscriptIntoTranscriptElement.js";
import handlePopupMessages from "./handlePopupMessages.js";
import showNextTranscript from "./showNextTranscript.js";
import showPreviousTranscript from "./showPreviousTranscript.js";
// listen to messages
chrome.runtime.onMessage.addListener(handlePopupMessages);
// set user_media_is_setup state to an initial value 'no'
// set default recording state to off
(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, chrome.storage.session.set({
                    "user_media_is_setup": false,
                    "recording": false
                })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); })();
// check if there is an API KEY
// send user to option page to set it if there is none
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var APIKey;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, chrome.storage.local.get("APIKey")];
            case 1:
                APIKey = (_a.sent()).APIKey;
                if (!APIKey)
                    chrome.runtime.openOptionsPage();
                return [2 /*return*/];
        }
    });
}); })();
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var tabId;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getCurrentTabId()];
            case 1:
                tabId = _a.sent();
                if (!tabId)
                    return [2 /*return*/]; // no tab id, no action
                return [4 /*yield*/, chrome.tabs.sendMessage(tabId, { name: "wifi_check" })];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); })();
var input = document.querySelector("input");
input === null || input === void 0 ? void 0 : input.addEventListener("click", function () { return __awaiter(void 0, void 0, void 0, function () {
    var tabId, sessionState, localState;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getCurrentTabId()];
            case 1:
                tabId = _a.sent();
                if (!tabId)
                    return [2 /*return*/]; // no tab id, no action
                return [4 /*yield*/, chrome.storage.session.get(null)];
            case 2:
                sessionState = _a.sent();
                return [4 /*yield*/, chrome.storage.local.get(["APIKey", "language"])];
            case 3:
                localState = _a.sent();
                return [4 /*yield*/, chrome.tabs.sendMessage(tabId, { name: "record_click", content: __assign(__assign({}, sessionState), localState) })];
            case 4:
                _a.sent();
                if (!sessionState.permission_granted) return [3 /*break*/, 6];
                // only applicable if user has granted permission
                Toggle.recordingAnimation();
                Toggle.hint();
                return [4 /*yield*/, changeRecordingState()];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6:
                handleLoadingIcon(sessionState.recording);
                return [2 /*return*/];
        }
    });
}); });
function getCurrentTabId() {
    return chrome.tabs.query({ active: true, currentWindow: true })
        .then(function (tabs) { return tabs[0].id; });
}
function handleLoadingIcon(recordingState) {
    if (recordingState) {
        // recording is on, button is pressed to switch it off
        // show loading icon because audio is being processed
        Toggle.loadingIcon();
    }
}
var expandMore = document.getElementById("expand-more");
var expandLess = document.getElementById("expand-less");
expandMore === null || expandMore === void 0 ? void 0 : expandMore.addEventListener("click", function () {
    expandMore.classList.toggle("hide");
    expandLess === null || expandLess === void 0 ? void 0 : expandLess.classList.toggle("hide");
    enterTranscriptIntoTranscriptElement();
    Toggle.transcript();
});
expandLess === null || expandLess === void 0 ? void 0 : expandLess.addEventListener("click", function () {
    expandMore === null || expandMore === void 0 ? void 0 : expandMore.classList.toggle("hide");
    expandLess === null || expandLess === void 0 ? void 0 : expandLess.classList.toggle("hide");
    Toggle.transcript();
});
var copyIcon = document.getElementById("copy-icon");
copyIcon === null || copyIcon === void 0 ? void 0 : copyIcon.addEventListener("click", copyTranscriptToClipboard);
var nextIcon = document.getElementById("next-icon");
nextIcon === null || nextIcon === void 0 ? void 0 : nextIcon.addEventListener("click", showNextTranscript);
var previousIcon = document.getElementById("previous-icon");
previousIcon === null || previousIcon === void 0 ? void 0 : previousIcon.addEventListener("click", showPreviousTranscript);
var settingsIcon = document.getElementById("settings-icon");
settingsIcon === null || settingsIcon === void 0 ? void 0 : settingsIcon.addEventListener("click", navigateToOptionsPage);
function navigateToOptionsPage() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, chrome.runtime.openOptionsPage()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
