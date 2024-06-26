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
// retrieve current API Key and language
(function () { return __awaiter(_this, void 0, void 0, function () {
    var _a, streamingLanguage, recordingLanguage, APIKey, enabledStreaming, chosenOption, chosenOption, APIKeyInput, enableStreamingInput, streamingLanguageCodes, recordingLanguageCodes;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, chrome.storage.local.get(null)];
            case 1:
                _a = _b.sent(), streamingLanguage = _a.streamingLanguage, recordingLanguage = _a.recordingLanguage, APIKey = _a.APIKey, enabledStreaming = _a.enabledStreaming;
                if (streamingLanguage) {
                    chosenOption = document.querySelector("select[id='streaming-language-codes'] option[value=".concat(streamingLanguage, "]"));
                    if (chosenOption)
                        chosenOption.setAttribute("selected", "");
                }
                if (recordingLanguage) {
                    chosenOption = document.querySelector("select[id='recording-language-codes'] option[value=".concat(recordingLanguage, "]"));
                    if (chosenOption)
                        chosenOption.setAttribute("selected", "");
                }
                if (APIKey) {
                    APIKeyInput = document.querySelector("input[type='password']");
                    enabledStreaming ? APIKeyInput === null || APIKeyInput === void 0 ? void 0 : APIKeyInput.setAttribute("disabled", "") : APIKeyInput === null || APIKeyInput === void 0 ? void 0 : APIKeyInput.removeAttribute("disabled");
                    if (APIKeyInput instanceof HTMLInputElement)
                        APIKeyInput.value = APIKey;
                }
                enableStreamingInput = document.querySelector("input[type='range']");
                if (enableStreamingInput) {
                    streamingLanguageCodes = document.getElementById('streaming-language-codes');
                    recordingLanguageCodes = document.getElementById('recording-language-codes');
                    if (enabledStreaming) {
                        enableStreamingInput.value = "1";
                        streamingLanguageCodes === null || streamingLanguageCodes === void 0 ? void 0 : streamingLanguageCodes.classList.remove('hide');
                        recordingLanguageCodes === null || recordingLanguageCodes === void 0 ? void 0 : recordingLanguageCodes.classList.add('hide');
                    }
                    else {
                        enableStreamingInput.value = "0";
                        streamingLanguageCodes === null || streamingLanguageCodes === void 0 ? void 0 : streamingLanguageCodes.classList.add('hide');
                        recordingLanguageCodes === null || recordingLanguageCodes === void 0 ? void 0 : recordingLanguageCodes.classList.remove('hide');
                    }
                }
                return [2 /*return*/];
        }
    });
}); })();
var form = document.querySelector("form");
form === null || form === void 0 ? void 0 : form.addEventListener("submit", saveSettings);
function saveSettings(event) {
    return __awaiter(this, void 0, void 0, function () {
        var formValues;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    event.preventDefault();
                    // show the spinner and remove button
                    toggleLoadingIconAndButton();
                    formValues = retrieveFormValues();
                    if (!formValues) return [3 /*break*/, 2];
                    return [4 /*yield*/, chrome.storage.local.set(formValues)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    // show the submit button and remove spinner
                    toggleLoadingIconAndButton();
                    showSavedAnimation();
                    return [2 /*return*/];
            }
        });
    });
}
function retrieveFormValues() {
    var recordingLanguageSelect = document.querySelector("select[id='recording-language-codes']");
    var streamingLanguageSelect = document.querySelector("select[id='streaming-language-codes']");
    var APIKeyInput = document.querySelector("input[type='password']");
    var enableStreamingInput = document.querySelector("input[type='range']");
    if (recordingLanguageSelect && streamingLanguageSelect && APIKeyInput && enableStreamingInput) {
        return {
            recordingLanguage: recordingLanguageSelect.value,
            streamingLanguage: streamingLanguageSelect.value,
            APIKey: APIKeyInput.value,
            enabledStreaming: Boolean(Number(enableStreamingInput.value))
        };
    }
}
function toggleLoadingIconAndButton() {
    var submitButton = document.querySelector("input[type='submit']");
    submitButton === null || submitButton === void 0 ? void 0 : submitButton.classList.toggle("hide");
    var spinner = document.getElementById("spinner");
    spinner === null || spinner === void 0 ? void 0 : spinner.classList.toggle("hide");
}
function showSavedAnimation() {
    var slider = document.getElementById("saved-slider");
    slider === null || slider === void 0 ? void 0 : slider.classList.toggle("hide");
    slider === null || slider === void 0 ? void 0 : slider.addEventListener("animationend", function () {
        slider.classList.toggle("hide");
    }, { once: true });
}
var enableStreamingInput = document.querySelector("input[type='range']");
enableStreamingInput === null || enableStreamingInput === void 0 ? void 0 : enableStreamingInput.addEventListener("change", function () {
    var APIKeyInput = document.querySelector("input[name='APIKey']");
    var streamingLanguageCodes = document.getElementById('streaming-language-codes');
    var recordingLanguageCodes = document.getElementById('recording-language-codes');
    if (enableStreamingInput.value == "1") {
        APIKeyInput === null || APIKeyInput === void 0 ? void 0 : APIKeyInput.setAttribute("disabled", "");
        streamingLanguageCodes === null || streamingLanguageCodes === void 0 ? void 0 : streamingLanguageCodes.classList.remove('hide');
        recordingLanguageCodes === null || recordingLanguageCodes === void 0 ? void 0 : recordingLanguageCodes.classList.add('hide');
    }
    else {
        APIKeyInput === null || APIKeyInput === void 0 ? void 0 : APIKeyInput.removeAttribute("disabled");
        streamingLanguageCodes === null || streamingLanguageCodes === void 0 ? void 0 : streamingLanguageCodes.classList.add('hide');
        recordingLanguageCodes === null || recordingLanguageCodes === void 0 ? void 0 : recordingLanguageCodes.classList.remove('hide');
    }
});
