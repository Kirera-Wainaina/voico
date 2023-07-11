var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
chrome.runtime.onMessage.addListener(handleRecording);
function handleRecording(message, sender, sendResponse) {
    return __awaiter(this, void 0, void 0, function* () {
        const { recording, recorded_before } = message;
        if (recording == "off" && recorded_before == "no") {
            // this is the first time recording
            // set up recorder
            yield startRecording();
        }
    });
}
function startRecording() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const stream = yield navigator.mediaDevices.getUserMedia({ audio: true });
            const audioData = [];
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();
            // mediaRecorder.addEventListener("stop", () => saveRecordedMedia(audioData));
            mediaRecorder.addEventListener("stop", () => handleDataSaving(audioData));
            mediaRecorder.addEventListener("dataavailable", event => combineAudioData(event, audioData));
        }
        catch (error) {
            console.log(error);
        }
    });
}
// async function handleRecording(element:HTMLInputElement, existingMediaRecorder?: MediaRecorder) {
//   toggleHintAndAnimation();
//   // remove prior event listeners
//   element?.replaceWith(element.cloneNode());
//   if (!existingMediaRecorder) {
//     // start recording
//     removeAudioElement();
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
function removeAudioElement() {
    const audioElement = document.querySelector("audio");
    if (audioElement) {
        audioElement.remove();
    }
}
function handleDataSaving(audioData) {
    const audioUrl = saveRecordedMedia(audioData);
    chrome.runtime.sendMessage({ name: "audioUrl", content: audioUrl });
}
function saveRecordedMedia(audioData) {
    const blob = new Blob(audioData, { type: "audio/webm;codecs=opus" });
    audioData = [];
    const audioUrl = window.URL.createObjectURL(blob);
    return audioUrl;
    // const audioElement = createAudioElement(audioUrl);
    // const script = document.querySelector("script");
    // script?.insertAdjacentElement("beforebegin", audioElement);
}
function combineAudioData(event, audioDataArray) {
    audioDataArray.push(event === null || event === void 0 ? void 0 : event.data);
}
