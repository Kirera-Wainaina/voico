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
var _this = this;
// save recording state to know if click should start/stop recording
var Recording;
(function (Recording) {
    Recording["ON"] = "on";
    Recording["OFF"] = "off";
})(Recording || (Recording = {}));
// state to know if we should initiate getUserMedia for the first time
var YesOrNo;
(function (YesOrNo) {
    YesOrNo["YES"] = "yes";
    YesOrNo["NO"] = "no";
})(YesOrNo || (YesOrNo = {}));
// listen to messages
chrome.runtime.onMessage.addListener(handlePopupMessages);
function handlePopupMessages(message) {
    switch (message.name) {
        case "transcript_received":
            toggleLoadingIcon();
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
            toggleLoadingIcon();
            break;
        case "is_online":
            handleWifiSituation(message.content);
        default:
            break;
    }
}
// set user_media_is_setup state to an initial value 'no'
// set default recording state to off
(function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, chrome.storage.session.set({
                    "user_media_is_setup": YesOrNo.NO,
                    "recording": Recording.OFF
                })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); })();
// check if there is an API KEY
// send user to option page to set it if there is none
(function () { return __awaiter(_this, void 0, void 0, function () {
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
(function () { return __awaiter(_this, void 0, void 0, function () {
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
input === null || input === void 0 ? void 0 : input.addEventListener("click", function () { return __awaiter(_this, void 0, void 0, function () {
    var tabId, state, state2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getCurrentTabId()];
            case 1:
                tabId = _a.sent();
                if (!tabId)
                    return [2 /*return*/]; // no tab id, no action
                return [4 /*yield*/, chrome.storage.session.get(null)];
            case 2:
                state = _a.sent();
                return [4 /*yield*/, chrome.storage.local.get(["APIKey", "language"])];
            case 3:
                state2 = _a.sent();
                return [4 /*yield*/, chrome.tabs.sendMessage(tabId, { name: "record_click", content: __assign(__assign({}, state), state2) })];
            case 4:
                _a.sent();
                if (!(state.permission_granted == YesOrNo.YES)) return [3 /*break*/, 6];
                // only applicable if user has granted permission
                toggleRecordingAnimation();
                toggleHint();
                return [4 /*yield*/, changeRecordingState()];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6:
                handleLoadingIcon(state.recording);
                return [2 /*return*/];
        }
    });
}); });
function toggleElementDisplay(name, type) {
    if (type === void 0) { type = "id"; }
    var element = type === "id"
        ? document.getElementById(name)
        : document.querySelector(name);
    element === null || element === void 0 ? void 0 : element.classList.toggle("hide");
}
// show animation to let user know the recording has started
function toggleRecordingAnimation() {
    toggleElementDisplay("recording-animation");
}
function toggleHint() {
    toggleElementDisplay("hint");
}
function togglePermissionNote() {
    toggleElementDisplay("permission-note");
}
function toggleTranscript() {
    toggleElementDisplay("transcript");
    toggleElementDisplay("transcript-controls");
    toggleElementDisplay("settings-icon");
}
function toggleLoadingIcon() {
    toggleElementDisplay("input", "tag");
    toggleElementDisplay("hint");
    toggleElementDisplay("spinner");
}
function changeRecordingState() {
    return __awaiter(this, void 0, void 0, function () {
        var recording;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, chrome.storage.session.get("recording")];
                case 1:
                    recording = (_a.sent()).recording;
                    if (recording == "off") {
                        chrome.storage.session.set({
                            "recording": Recording.ON,
                            "user_media_is_setup": YesOrNo.YES
                        });
                    }
                    else {
                        chrome.storage.session.set({ "recording": Recording.OFF });
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function getCurrentTabId() {
    return chrome.tabs.query({ active: true, currentWindow: true })
        .then(function (tabs) { return tabs[0].id; });
}
function handleLoadingIcon(recordingState) {
    if (recordingState == Recording.ON) {
        // recording is on, button is pressed to switch it off
        // show loading icon because audio is being processed
        toggleLoadingIcon();
    }
}
function handlePermissionDenied() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // restore state
                return [4 /*yield*/, chrome.storage.session.set({
                        "user_media_is_setup": YesOrNo.NO,
                        "recording": Recording.OFF,
                        "permission_granted": YesOrNo.NO
                    })
                    // show the permission note
                ];
                case 1:
                    // restore state
                    _a.sent();
                    // show the permission note
                    togglePermissionNote();
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
                    if (permission_granted == YesOrNo.YES)
                        return [2 /*return*/];
                    return [4 /*yield*/, chrome.storage.session.set({ "permission_granted": YesOrNo.YES })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, changeRecordingState()];
                case 3:
                    _a.sent();
                    toggleRecordingAnimation();
                    toggleHint();
                    return [2 /*return*/];
            }
        });
    });
}
var expandMore = document.getElementById("expand-more");
var expandLess = document.getElementById("expand-less");
expandMore === null || expandMore === void 0 ? void 0 : expandMore.addEventListener("click", function () {
    expandMore.classList.toggle("hide");
    expandLess === null || expandLess === void 0 ? void 0 : expandLess.classList.toggle("hide");
    enterTranscriptIntoTranscriptElement();
    toggleTranscript();
});
expandLess === null || expandLess === void 0 ? void 0 : expandLess.addEventListener("click", function () {
    expandMore === null || expandMore === void 0 ? void 0 : expandMore.classList.toggle("hide");
    expandLess === null || expandLess === void 0 ? void 0 : expandLess.classList.toggle("hide");
    toggleTranscript();
});
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
function enterTranscriptIntoTranscriptElement() {
    return __awaiter(this, void 0, void 0, function () {
        var transcripts, transcriptElement;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, chrome.storage.local.get("transcripts")];
                case 1:
                    transcripts = (_a.sent()).transcripts;
                    transcriptElement = document.getElementById("transcript");
                    if (transcripts && transcriptElement) {
                        transcripts = JSON.parse(transcripts);
                        transcriptElement.textContent = transcripts[0];
                    }
                    else if (!transcripts && transcriptElement) {
                        transcriptElement.textContent = "no transcripts yet!";
                    }
                    return [2 /*return*/];
            }
        });
    });
}
var copyIcon = document.getElementById("copy-icon");
copyIcon === null || copyIcon === void 0 ? void 0 : copyIcon.addEventListener("click", copyTranscriptToClipboard);
function copyTranscriptToClipboard() {
    return __awaiter(this, void 0, void 0, function () {
        var transcriptElement, transcriptContent, copiedNotification;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    transcriptElement = document.getElementById("transcript");
                    transcriptContent = transcriptElement === null || transcriptElement === void 0 ? void 0 : transcriptElement.textContent;
                    if (!(typeof transcriptContent == 'string')) return [3 /*break*/, 2];
                    return [4 /*yield*/, navigator.clipboard.writeText(transcriptContent)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    copiedNotification = document.getElementById("copied-notification");
                    if (copiedNotification)
                        showNotification(copiedNotification);
                    return [2 /*return*/];
            }
        });
    });
}
function showNotification(element) {
    element === null || element === void 0 ? void 0 : element.classList.toggle("hide");
    element === null || element === void 0 ? void 0 : element.classList.toggle("notify");
    // hide the notification again
    element === null || element === void 0 ? void 0 : element.addEventListener("animationend", function () {
        element === null || element === void 0 ? void 0 : element.classList.toggle("hide");
        element === null || element === void 0 ? void 0 : element.classList.toggle("notify");
    });
}
var nextIcon = document.getElementById("next-icon");
nextIcon === null || nextIcon === void 0 ? void 0 : nextIcon.addEventListener("click", showNextTranscript);
function showNextTranscript() {
    return __awaiter(this, void 0, void 0, function () {
        var transcripts, transcriptsArray, transcriptElement, currentTranscript, index, nextIndex;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, chrome.storage.local.get("transcripts")];
                case 1:
                    transcripts = (_a.sent()).transcripts;
                    if (!transcripts) {
                        return [2 /*return*/];
                    }
                    transcriptsArray = JSON.parse(transcripts);
                    transcriptElement = document.getElementById("transcript");
                    currentTranscript = transcriptElement === null || transcriptElement === void 0 ? void 0 : transcriptElement.textContent;
                    if (!currentTranscript)
                        return [2 /*return*/];
                    index = transcriptsArray
                        .findIndex(function (transcript) { return transcript === currentTranscript; });
                    nextIndex = (index + 1) >= transcriptsArray.length ? 0 : index + 1;
                    transcriptElement.textContent = transcriptsArray[nextIndex];
                    adjustTranscriptNumber(nextIndex);
                    return [2 /*return*/];
            }
        });
    });
}
var previousIcon = document.getElementById("previous-icon");
previousIcon === null || previousIcon === void 0 ? void 0 : previousIcon.addEventListener("click", showPreviousTranscript);
function showPreviousTranscript() {
    return __awaiter(this, void 0, void 0, function () {
        var transcripts, transcriptsArray, transcriptElement, currentTranscript, index, previousIndex;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, chrome.storage.local.get("transcripts")];
                case 1:
                    transcripts = (_a.sent()).transcripts;
                    if (!transcripts) {
                        return [2 /*return*/];
                    }
                    transcriptsArray = JSON.parse(transcripts);
                    transcriptElement = document.getElementById("transcript");
                    currentTranscript = transcriptElement === null || transcriptElement === void 0 ? void 0 : transcriptElement.textContent;
                    if (!currentTranscript)
                        return [2 /*return*/];
                    index = transcriptsArray
                        .findIndex(function (transcript) { return transcript === currentTranscript; });
                    previousIndex = (index - 1) < 0 ? transcriptsArray.length - 1 : index - 1;
                    transcriptElement.textContent = transcriptsArray[previousIndex];
                    adjustTranscriptNumber(previousIndex);
                    return [2 /*return*/];
            }
        });
    });
}
function adjustTranscriptNumber(newIndex) {
    // let the user know which transcript they are looking at out of 5
    var transcriptNumberElement = document.getElementById("transcript-number");
    var transcriptNumber = newIndex + 1;
    if (transcriptNumberElement) {
        transcriptNumberElement.textContent = "".concat(transcriptNumber, " / 5");
    }
}
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
function handleWifiSituation(status) {
    if (status)
        return; // do nothing if there is wifi
    // show the no wifi icon
    toggleElementDisplay("no-wifi-icon");
    // hide the record button and hint
    toggleElementDisplay("mic");
    toggleElementDisplay("hint");
}
