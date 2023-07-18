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
        default:
            break;
    }
}
// set user_media_is_setup state to an initial value 'no'
// set default recording state to off
(() => __awaiter(this, void 0, void 0, function* () {
    yield chrome.storage.session.set({
        "user_media_is_setup": YesOrNo.NO,
        "recording": Recording.OFF
    });
}))();
const input = document.querySelector("input");
input === null || input === void 0 ? void 0 : input.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
    const tabId = yield getCurrentTabId();
    if (!tabId)
        return; // no tab id, no action
    const state = yield chrome.storage.session.get(null);
    yield chrome.tabs.sendMessage(tabId, { name: "record_click", content: state });
    if (state.permission_granted == YesOrNo.YES) {
        // only applicable if user has granted permission
        toggleRecordingAnimation();
        toggleHint();
        yield changeRecordingState();
    }
    handleLoadingIcon(state.recording);
}));
// show animation to let user know the recording has started
function toggleRecordingAnimation() {
    const recordingAnimation = document.getElementById("recording-animation");
    recordingAnimation === null || recordingAnimation === void 0 ? void 0 : recordingAnimation.classList.toggle("hide");
}
function toggleHint() {
    const hint = document.querySelector("p");
    hint === null || hint === void 0 ? void 0 : hint.classList.toggle("hide");
}
function togglePermissionNote() {
    const note = document.getElementById("permission-note");
    note === null || note === void 0 ? void 0 : note.classList.toggle("hide");
}
function toggleTranscript() {
    const transcript = document.getElementById("transcript");
    transcript === null || transcript === void 0 ? void 0 : transcript.classList.toggle("hide");
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
function getCurrentTabId() {
    return chrome.tabs.query({ active: true, currentWindow: true })
        .then(tabs => tabs[0].id);
}
function handleLoadingIcon(recordingState) {
    if (recordingState == Recording.ON) {
        // recording is on, button is pressed to switch it off
        // show loading icon because audio is being processed
        toggleLoadingIcon();
    }
}
function toggleLoadingIcon() {
    const input = document.querySelector("input");
    input === null || input === void 0 ? void 0 : input.classList.toggle("hide");
    const hint = document.getElementById("hint");
    hint === null || hint === void 0 ? void 0 : hint.classList.toggle("hide");
    // display the loading icon
    const spinner = document.getElementById("spinner");
    spinner === null || spinner === void 0 ? void 0 : spinner.classList.toggle("hide");
}
function handlePermissionDenied() {
    return __awaiter(this, void 0, void 0, function* () {
        // restore state
        yield chrome.storage.session.set({
            "user_media_is_setup": YesOrNo.NO,
            "recording": Recording.OFF,
            "permission_granted": YesOrNo.NO
        });
        // show the permission note
        togglePermissionNote();
    });
}
function handlePermissionGranted() {
    return __awaiter(this, void 0, void 0, function* () {
        const { permission_granted } = yield chrome.storage.session.get("permission_granted");
        // if permission was set, nothing to do
        if (permission_granted == YesOrNo.YES)
            return;
        yield chrome.storage.session.set({ "permission_granted": YesOrNo.YES });
        yield changeRecordingState();
        toggleRecordingAnimation();
        toggleHint();
        return;
    });
}
const expandMore = document.getElementById("expand-more");
const expandLess = document.getElementById("expand-less");
expandMore === null || expandMore === void 0 ? void 0 : expandMore.addEventListener("click", () => {
    expandMore.classList.toggle("hide");
    expandLess === null || expandLess === void 0 ? void 0 : expandLess.classList.toggle("hide");
    enterTranscriptIntoTranscriptElement();
    toggleTranscript();
});
expandLess === null || expandLess === void 0 ? void 0 : expandLess.addEventListener("click", () => {
    expandMore === null || expandMore === void 0 ? void 0 : expandMore.classList.toggle("hide");
    expandLess === null || expandLess === void 0 ? void 0 : expandLess.classList.toggle("hide");
    toggleTranscript();
});
function saveTranscript(text) {
    return __awaiter(this, void 0, void 0, function* () {
        let { transcripts } = yield chrome.storage.local.get("transcripts");
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
        yield chrome.storage.local.set({ "transcripts": JSON.stringify(transcripts) });
        enterTranscriptIntoTranscriptElement();
    });
}
function enterTranscriptIntoTranscriptElement() {
    return __awaiter(this, void 0, void 0, function* () {
        let { transcripts } = yield chrome.storage.local.get("transcripts");
        transcripts = JSON.parse(transcripts);
        const transcriptElement = document.getElementById("transcript");
        if (transcriptElement) {
            const transcriptText = transcripts.length ? transcripts[0] : 'no transcripts yet!';
            transcriptElement.textContent = transcriptText;
        }
    });
}
