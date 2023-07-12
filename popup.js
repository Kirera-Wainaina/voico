var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
// set default recording state to off
chrome.storage.session.set({
    "recording": Recording.OFF,
});
chrome.runtime.onMessage.addListener(handleMessages);
// load the recording content script to ensure it loads
// prevents the error: could not establish connection
(() => __awaiter(this, void 0, void 0, function* () {
    const tabId = yield getCurrentTabId();
    if (typeof tabId === "number") {
        yield chrome.scripting.executeScript({
            target: { tabId },
            files: ["content-script.js"]
        });
    }
}))();
// set user_media_is_setup state to an initial value 'no'
(() => __awaiter(this, void 0, void 0, function* () {
    yield chrome.storage.session.set({ "user_media_is_setup": YesOrNo.NO });
}))();
const input = document.querySelector("input");
input === null || input === void 0 ? void 0 : input.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
    const tabId = yield getCurrentTabId();
    if (typeof tabId === "number") {
        const state = yield chrome.storage.session.get(null);
        yield chrome.tabs.sendMessage(tabId, { name: "record_click", content: state });
        if (state.recording == "off") {
            // remove previous audio element, if any
            removeAudioElement();
        }
    }
    toggleHintAndAnimation();
    changeRecordingState();
}));
// show animation to let user know the recording has started
function toggleHintAndAnimation() {
    const hint = document.querySelector("p");
    hint === null || hint === void 0 ? void 0 : hint.classList.toggle("hide");
    const recordingAnimation = document.getElementById("recording-animation");
    recordingAnimation === null || recordingAnimation === void 0 ? void 0 : recordingAnimation.classList.toggle("hide");
}
function changeRecordingState() {
    return __awaiter(this, void 0, void 0, function* () {
        const { recording } = yield chrome.storage.session.get("recording");
        if (recording == "off") {
            chrome.storage.session.set({
                "recording": Recording.ON,
                "user_media_is_setup": YesOrNo.YES
            });
        }
        else {
            chrome.storage.session.set({ "recording": Recording.OFF });
        }
    });
}
function createAudioElement(src) {
    const audioElement = new Audio(src);
    audioElement.setAttribute("controls", "");
    // audioElement.setAttribute("src", src);
    return audioElement;
}
function handleMessages(message) {
    if (message.name == "audio-data") {
        saveRecordedMedia(message.content);
    }
}
function displayAudioElement(audioUrl) {
    const audioElement = createAudioElement(audioUrl);
    const script = document.querySelector("script");
    script === null || script === void 0 ? void 0 : script.insertAdjacentElement("beforebegin", audioElement);
}
function removeAudioElement() {
    const audioElement = document.querySelector("audio");
    if (audioElement) {
        audioElement.remove();
    }
}
function getCurrentTabId() {
    return chrome.tabs.query({ active: true, currentWindow: true })
        .then(tabs => tabs[0].id);
}
function saveRecordedMedia(audioData) {
    const blob = new Blob([audioData]);
    // const blob = new Blob([audioData], { type: "audio/webm;codecs=opus"});
    console.log(blob);
    const audioUrl = window.URL.createObjectURL(blob);
    displayAudioElement(audioUrl);
    return audioUrl;
}
