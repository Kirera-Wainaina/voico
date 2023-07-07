var input = document.querySelector("input");
// input?.addEventListener("click", () => handleRecording(input));
input === null || input === void 0 ? void 0 : input.addEventListener("click", function () {
    handleRecording(input);
    console.log('recording...');
});
var audioContext = new AudioContext();
function toggleHintAndAnimation() {
    var hint = document.querySelector("p");
    hint === null || hint === void 0 ? void 0 : hint.classList.toggle("hide");
    var recordingAnimation = document.getElementById("recording-animation");
    recordingAnimation === null || recordingAnimation === void 0 ? void 0 : recordingAnimation.classList.toggle("hide");
}
function handleRecording(element, existingMediaRecorder) {
    toggleHintAndAnimation();
    // remove prior event listeners
    element === null || element === void 0 ? void 0 : element.replaceWith(element.cloneNode());
    if (!existingMediaRecorder) {
        // start recording
        removeAudioElement();
        startRecording();
    }
    else {
        if (existingMediaRecorder.state == "inactive") {
            // restart recording
            existingMediaRecorder.start();
            removeAudioElement();
        }
        else {
            // stop recording
            existingMediaRecorder.stop();
        }
        var input_1 = document.querySelector("input");
        input_1 === null || input_1 === void 0 ? void 0 : input_1.addEventListener("click", function () { return handleRecording(input_1, existingMediaRecorder); });
    }
}
function saveRecordedMedia(audioData) {
    console.log(audioData);
    var blob = new Blob(audioData, { type: "audio/webm;codecs=opus" });
    var audioUrl = URL.createObjectURL(blob);
    var audioElement = createAudioElement(audioUrl);
    var script = document.querySelector("script");
    script === null || script === void 0 ? void 0 : script.insertAdjacentElement("beforebegin", audioElement);
}
function combineAudioData(event, audioDataArray) {
    audioDataArray.push(event === null || event === void 0 ? void 0 : event.data);
}
function createAudioElement(src) {
    var audioElement = document.createElement("audio");
    audioElement.setAttribute("controls", "");
    audioElement.setAttribute("src", src);
    return audioElement;
}
function removeAudioElement() {
    var audioElement = document.querySelector("audio");
    if (audioElement) {
        audioElement.remove();
    }
}
function startRecording() {
    chrome.tabCapture.capture({ audio: true }, function (stream) {
        if (stream) {
            var audioData_1 = [];
            var mediaRecorder_1 = new MediaRecorder(stream);
            mediaRecorder_1.start();
            var input_2 = document.querySelector("input");
            console.log(input_2);
            input_2 === null || input_2 === void 0 ? void 0 : input_2.addEventListener("click", function () { return handleRecording(input_2, mediaRecorder_1); });
            mediaRecorder_1.addEventListener("stop", function () { return saveRecordedMedia(audioData_1); });
            mediaRecorder_1.addEventListener("dataavailable", function (event) { return combineAudioData(event, audioData_1); });
        }
    });
}
