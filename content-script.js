var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// so far I think I can get content scripts to work
/*
consider using the content script as an endpoint
all click events are relayed to it
Once it receives a click event,
  It'll check through storage api if user_media is set up
  if not: ask user for permission
  if yes: decided if to start or stop recording

  see if I can pass audio data through an event to popup file so an
  audio element is created
*/
var mediaRecorder = null;
chrome.runtime.onMessage.addListener(handleContentScriptMessages);
function handleContentScriptMessages(message) {
    return __awaiter(this, void 0, void 0, function* () {
        if (message.name === "record_click") {
            yield handleRecording(message.content);
        }
    });
}
function handleRecording(content) {
    return __awaiter(this, void 0, void 0, function* () {
        // set up user media if it doesn't exist
        // this is the case for every first click on extension
        if (!content.user_media_is_setup || content.user_media_is_setup == "no") {
            const result = yield setupRecording();
            if (result) {
                mediaRecorder = result;
                mediaRecorder.start();
            }
        }
        else if (content.recording === "off") {
            mediaRecorder === null || mediaRecorder === void 0 ? void 0 : mediaRecorder.start();
        }
        else {
            mediaRecorder === null || mediaRecorder === void 0 ? void 0 : mediaRecorder.stop();
        }
    });
}
function setupRecording() {
    return __awaiter(this, void 0, void 0, function* () {
        const stream = yield navigator.mediaDevices.getUserMedia({ audio: true });
        if (stream) {
            const audioData = [];
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.addEventListener("stop", () => transmitAudio(audioData));
            mediaRecorder.addEventListener("dataavailable", event => combineAudioData(event, audioData));
            return mediaRecorder;
        }
    });
}
function combineAudioData(event, audioDataArray) {
    audioDataArray.unshift(event === null || event === void 0 ? void 0 : event.data);
}
function transmitAudio(audioData) {
    const blob = new Blob(audioData, { type: "audio/webm;codecs=opus" });
    const formdata = new FormData();
    formdata.append("audio", blob);
    formdata.append("fileNumber", "1");
    audioData = [];
    fetch("https://voico.ddns.net/api/transcribe", {
        method: "POST",
        body: formdata,
        mode: "cors"
    }).then(response => response.text())
        .then(text => console.log(text));
}
