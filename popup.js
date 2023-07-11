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
// let mediaRecorder: MediaRecorder;
const input = document.querySelector("input");
input === null || input === void 0 ? void 0 : input.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
    // await triggerRecordingThroughOffscreenDocument();
    // check if we asked for user permission
    // if not: ask for permission and setup mediaRecorder
    // const {user_media_is_setup, recording } = await chrome.storage.session.get(
    //   ["user_media_is_setup", "recording"]
    // );
    // if (user_media_is_setup == "no" || !user_media_is_setup) {
    //   await chrome.storage.session.set({
    //     "user_media_is_setup": YesOrNo.YES
    //   });
    //   await setupRecording()
    //   removeAudioElement()
    // } else if (recording == "off") {
    //   // we already asked for permission but the recorder is off
    //   mediaRecorder.start();
    //   removeAudioElement()
    // } else {
    //   // the recorder is on, so we stop it.
    //   mediaRecorder.stop()
    // }
    const tabId = yield getCurrentTabId();
    if (typeof tabId === "number") {
        const state = yield chrome.storage.session.get(null);
        yield chrome.tabs.sendMessage(tabId, { name: "record_click", content: state });
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
function handleMessages(message) {
    console.log(message, "received");
    if (message.name == "audioUrl") {
        displayAudioElement(message.content);
    }
    else if (message.name == "remove-audio-element") {
        removeAudioElement();
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
// async function getUserMediaStream() {
//   // run function as content script in order to acquire user permission
//   // local function calling the getUserMedia method
//   async function getStream() {
//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
//     return stream
//   }
//   const tabId = await getCurrentTabId();
//   if (typeof tabId == "number") {
//     return chrome.scripting.executeScript({
//       target: {tabId},
//       func: getStream
//     }).then(([feedback]) => {
//       console.log(feedback)
//       if (feedback.result) {
//         // the stream is in the result property
//         return feedback.result
//       }
//     })
//   }
// }
function getCurrentTabId() {
    return chrome.tabs.query({ active: true, lastFocusedWindow: true })
        .then(tabs => tabs[0].id);
}
function saveRecordedMedia(audioData) {
    const blob = new Blob(audioData, { type: "audio/webm;codecs=opus" });
    audioData = [];
    const audioUrl = window.URL.createObjectURL(blob);
    displayAudioElement(audioUrl);
    // return audioUrl
    return;
}
function combineAudioData(event, audioDataArray) {
    audioDataArray.push(event === null || event === void 0 ? void 0 : event.data);
}
