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
// getUserMedia needs to work through the offscreen html file
// create offscreen document to get permission to operate the api
chrome.offscreen.createDocument({
    url: "offscreen-recording.html",
    reasons: [chrome.offscreen.Reason.USER_MEDIA],
    justification: "Record audio for transcription"
});
// set default recording state to off
chrome.storage.session.set({ "recording": Recording.OFF });
const input = document.querySelector("input");
// input?.addEventListener("click", triggerRecordingThroughOffscreenDocument)
input === null || input === void 0 ? void 0 : input.addEventListener("click", toggleHintAndAnimation);
function triggerRecordingThroughOffscreenDocument() {
    return __awaiter(this, void 0, void 0, function* () {
        // send message to offscreen to start recording
        yield chrome.runtime.sendMessage("handle-recording");
    });
}
function toggleHintAndAnimation() {
    const hint = document.querySelector("p");
    hint === null || hint === void 0 ? void 0 : hint.classList.toggle("hide");
    const recordingAnimation = document.getElementById("recording-animation");
    recordingAnimation === null || recordingAnimation === void 0 ? void 0 : recordingAnimation.classList.toggle("hide");
}
