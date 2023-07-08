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
const input = document.querySelector("input");
input === null || input === void 0 ? void 0 : input.addEventListener("click", triggerRecordingThroughOffscreenDocument);
function triggerRecordingThroughOffscreenDocument() {
    return __awaiter(this, void 0, void 0, function* () {
        // send message to offscreen to start recording
        yield chrome.runtime.sendMessage("handle-recording");
    });
}
