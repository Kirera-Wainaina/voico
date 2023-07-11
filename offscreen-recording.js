var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
chrome.runtime.onMessage.addListener(handleOffscreenMessages);
function handleOffscreenMessages(message) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("called");
        if (message.name == "recording_state") {
            yield handleRecording(message.content);
        }
    });
}
function handleRecording(content) {
    return __awaiter(this, void 0, void 0, function* () {
        let mediaRecorder = null;
        const { recording, recorded_before } = content;
        if (recording == "off" && recorded_before == "no") {
            // this is the first time recording
            // set up recorder
            const result = yield setupRecording();
            if (result) {
                mediaRecorder = result;
                mediaRecorder.start();
            }
            ;
            handleAudioElementRemoval();
        }
        else if (recording == "off" && recorded_before == "yes") {
            // media recorder has already been set up 
            if (mediaRecorder)
                mediaRecorder.start();
            handleAudioElementRemoval();
        }
        else {
            // recording is on and its time to pause
            if (mediaRecorder)
                mediaRecorder.stop();
        }
    });
}
function setupRecording() {
    return __awaiter(this, void 0, void 0, function* () {
        const stream = yield navigator.mediaDevices.getUserMedia({ audio: true });
        const audioData = [];
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.addEventListener("stop", () => handleDataSaving(audioData));
        mediaRecorder.addEventListener("dataavailable", event => combineAudioData(event, audioData));
        return mediaRecorder;
    });
}
function handleDataSaving(audioData) {
    return __awaiter(this, void 0, void 0, function* () {
        const audioUrl = saveRecordedMedia(audioData);
        yield chrome.runtime.sendMessage({ name: "audioUrl", content: audioUrl });
        return;
    });
}
function saveRecordedMedia(audioData) {
    const blob = new Blob(audioData, { type: "audio/webm;codecs=opus" });
    audioData = [];
    const audioUrl = window.URL.createObjectURL(blob);
    return audioUrl;
}
function combineAudioData(event, audioDataArray) {
    audioDataArray.push(event === null || event === void 0 ? void 0 : event.data);
}
function handleAudioElementRemoval() {
    chrome.runtime.sendMessage({ name: "remove-audio-element" });
}
