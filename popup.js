var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// is the extension currently recording
var Recording;
(function (Recording) {
    Recording["YES"] = "yes";
    Recording["NO"] = "no";
})(Recording || (Recording = {}));
const input = document.querySelector("input");
input === null || input === void 0 ? void 0 : input.addEventListener("click", () => {
    toggleHintAndAnimation();
    // handleRecording(input)
    handleRecording();
    changeRecordingState();
});
function toggleHintAndAnimation() {
    const hint = document.querySelector("p");
    hint === null || hint === void 0 ? void 0 : hint.classList.toggle("hide");
    const recordingAnimation = document.getElementById("recording-animation");
    recordingAnimation === null || recordingAnimation === void 0 ? void 0 : recordingAnimation.classList.toggle("hide");
}
// async function handleRecording(element:HTMLInputElement, existingMediaRecorder?: MediaRecorder) {
//   // remove prior event listeners
//   element?.replaceWith(element.cloneNode());
//   if (!existingMediaRecorder) {
//     // start recording
//     removeAudioElement()
//     await startRecording()  
//   } else {
//     if (existingMediaRecorder.state == "inactive") {
//       // restart recording
//       existingMediaRecorder.start();
//       removeAudioElement();
//     } else {
//       // stop recording
//       existingMediaRecorder.stop();
//     }
//     const input = document.querySelector("input");
//     input?.addEventListener("click", () => handleRecording(input, existingMediaRecorder))  
//   }
// }
function handleRecording() {
    return __awaiter(this, void 0, void 0, function* () {
        // get the current recording state
        const { recording } = yield chrome.storage.session.get("recording");
        if (recording == Recording.NO || !recording) {
            // start recording
        }
    });
}
function saveRecordedMedia(audioData) {
    const blob = new Blob(audioData, { type: "audio/mp3; codecs=opus" });
    audioData = [];
    const audioUrl = window.URL.createObjectURL(blob);
    const audioElement = createAudioElement(audioUrl);
    const script = document.querySelector("script");
    script === null || script === void 0 ? void 0 : script.insertAdjacentElement("beforebegin", audioElement);
}
function combineAudioData(event, audioDataArray) {
    audioDataArray.push(event === null || event === void 0 ? void 0 : event.data);
}
function createAudioElement(src) {
    const audioElement = new Audio("src");
    audioElement.setAttribute("controls", "");
    audioElement.setAttribute("src", src);
    return audioElement;
}
function removeAudioElement() {
    const audioElement = document.querySelector("audio");
    if (audioElement) {
        audioElement.remove();
    }
}
function startRecording() {
    chrome.tabCapture.capture({ audio: true }, (stream) => {
        if (stream) {
            // Continue to play the captured audio to the user.
            const output = new AudioContext();
            const source = output.createMediaStreamSource(stream);
            source.connect(output.destination);
            const audioData = [];
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();
            const input = document.querySelector("input");
            input === null || input === void 0 ? void 0 : input.addEventListener("click", () => handleRecording(input, mediaRecorder));
            mediaRecorder.addEventListener("stop", () => saveRecordedMedia(audioData));
            mediaRecorder.addEventListener("dataavailable", event => combineAudioData(event, audioData));
        }
    });
}
function changeRecordingState() {
    return __awaiter(this, void 0, void 0, function* () {
        const { recording } = yield chrome.storage.session.get("recording");
        if (recording == Recording.YES) {
            yield chrome.storage.session.set({ "recording": Recording.NO });
        }
        else {
            yield chrome.storage.session.set({ "recording": Recording.YES });
        }
    });
}
