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
        case "server_error":
            const errorNotification = document.getElementById("server-error");
            if (errorNotification)
                showNotification(errorNotification);
            toggleLoadingIcon();
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
// check if there is an API KEY
// send user to option page to set it if there is none
(() => __awaiter(this, void 0, void 0, function* () {
    const { APIKey } = yield chrome.storage.local.get("APIKey");
    if (!APIKey)
        chrome.runtime.openOptionsPage();
}))();
const input = document.querySelector("input");
input === null || input === void 0 ? void 0 : input.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
    const tabId = yield getCurrentTabId();
    if (!tabId)
        return; // no tab id, no action
    const state = yield chrome.storage.session.get(null);
    // get API KEY and language
    const state2 = yield chrome.storage.local.get(["APIKey", "language"]);
    yield chrome.tabs.sendMessage(tabId, { name: "record_click", content: Object.assign(Object.assign({}, state), state2) });
    if (state.permission_granted == YesOrNo.YES) {
        // only applicable if user has granted permission
        toggleRecordingAnimation();
        toggleHint();
        yield changeRecordingState();
    }
    handleLoadingIcon(state.recording);
}));
function toggleElementDisplay(name, type = "id") {
    const element = type === "id"
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
const copyIcon = document.getElementById("copy-icon");
copyIcon === null || copyIcon === void 0 ? void 0 : copyIcon.addEventListener("click", copyTranscriptToClipboard);
function copyTranscriptToClipboard() {
    return __awaiter(this, void 0, void 0, function* () {
        const transcriptElement = document.getElementById("transcript");
        const transcriptContent = transcriptElement === null || transcriptElement === void 0 ? void 0 : transcriptElement.textContent;
        if (typeof transcriptContent == 'string') {
            yield navigator.clipboard.writeText(transcriptContent);
        }
        const copiedNotification = document.getElementById("copied-notification");
        if (copiedNotification)
            showNotification(copiedNotification);
    });
}
function showNotification(element) {
    element === null || element === void 0 ? void 0 : element.classList.toggle("hide");
    element === null || element === void 0 ? void 0 : element.classList.toggle("notify");
    // hide the notification again
    element === null || element === void 0 ? void 0 : element.addEventListener("animationend", () => {
        element === null || element === void 0 ? void 0 : element.classList.toggle("hide");
        element === null || element === void 0 ? void 0 : element.classList.toggle("notify");
    });
}
const nextIcon = document.getElementById("next-icon");
nextIcon === null || nextIcon === void 0 ? void 0 : nextIcon.addEventListener("click", showNextTranscript);
function showNextTranscript() {
    return __awaiter(this, void 0, void 0, function* () {
        let { transcripts } = yield chrome.storage.local.get("transcripts");
        const transcriptsArray = JSON.parse(transcripts);
        const transcriptElement = document.getElementById("transcript");
        const currentTranscript = transcriptElement === null || transcriptElement === void 0 ? void 0 : transcriptElement.textContent;
        if (!currentTranscript)
            return;
        const index = transcriptsArray
            .findIndex(transcript => transcript === currentTranscript);
        const nextIndex = (index + 1) >= transcriptsArray.length ? 0 : index + 1;
        transcriptElement.textContent = transcriptsArray[nextIndex];
        adjustTranscriptNumber(nextIndex);
    });
}
const previousIcon = document.getElementById("previous-icon");
previousIcon === null || previousIcon === void 0 ? void 0 : previousIcon.addEventListener("click", showPreviousTranscript);
function showPreviousTranscript() {
    return __awaiter(this, void 0, void 0, function* () {
        let { transcripts } = yield chrome.storage.local.get("transcripts");
        const transcriptsArray = JSON.parse(transcripts);
        const transcriptElement = document.getElementById("transcript");
        const currentTranscript = transcriptElement === null || transcriptElement === void 0 ? void 0 : transcriptElement.textContent;
        if (!currentTranscript)
            return;
        const index = transcriptsArray
            .findIndex(transcript => transcript === currentTranscript);
        const previousIndex = (index - 1) < 0 ? transcriptsArray.length - 1 : index - 1;
        transcriptElement.textContent = transcriptsArray[previousIndex];
        adjustTranscriptNumber(previousIndex);
    });
}
function adjustTranscriptNumber(newIndex) {
    // let the user know which transcript they are looking at out of 5
    const transcriptNumberElement = document.getElementById("transcript-number");
    let transcriptNumber = newIndex + 1;
    if (transcriptNumberElement) {
        transcriptNumberElement.textContent = `${transcriptNumber} / 5`;
    }
}
const settingsIcon = document.getElementById("settings-icon");
settingsIcon === null || settingsIcon === void 0 ? void 0 : settingsIcon.addEventListener("click", navigateToOptionsPage);
function navigateToOptionsPage() {
    return __awaiter(this, void 0, void 0, function* () {
        yield chrome.runtime.openOptionsPage();
    });
}
