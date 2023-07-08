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
// check if offscreen exists to set default value
// if it doesn't then it's first time popup is clicked
chrome.storage.session.get("offscreen_exists", ({ offscreen_exists }) => {
    if (offscreen_exists == "no" || !offscreen_exists) {
        // set initial values
        chrome.storage.session.set({
            "offscreen_exists": YesOrNo.YES,
            "recorded_before": YesOrNo.NO,
        });
        // getUserMedia needs to work through the offscreen html file
        // create offscreen document to get permission to operate the api
        chrome.offscreen.createDocument({
            url: "offscreen-recording.html",
            reasons: [chrome.offscreen.Reason.USER_MEDIA],
            justification: "Record audio for transcription"
        });
    }
});
const input = document.querySelector("input");
input === null || input === void 0 ? void 0 : input.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
    yield triggerRecordingThroughOffscreenDocument();
    toggleHintAndAnimation();
    changeRecordingState();
}));
function triggerRecordingThroughOffscreenDocument() {
    return __awaiter(this, void 0, void 0, function* () {
        // send message to offscreen to start recording
        const state = yield chrome.storage.session.get(["recording", "recorded_before"]);
        const response = yield chrome.runtime.sendMessage(state);
    });
}
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
                "recorded_before": YesOrNo.YES
            });
        }
        else {
            chrome.storage.session.set({ "recording": Recording.OFF });
        }
    });
}
function createAudioElement(src) {
    const audioElement = new Audio("src");
    audioElement.setAttribute("controls", "");
    audioElement.setAttribute("src", src);
    return audioElement;
}
