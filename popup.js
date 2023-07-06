var input = document.querySelector("input");
input === null || input === void 0 ? void 0 : input.addEventListener("click", startRecording);
function toggleHintAndAnimation() {
    var hint = document.querySelector("p");
    hint === null || hint === void 0 ? void 0 : hint.classList.toggle("hide");
    var recordingAnimation = document.getElementById("recording-animation");
    recordingAnimation === null || recordingAnimation === void 0 ? void 0 : recordingAnimation.classList.toggle("hide");
}
function startRecording() {
    toggleHintAndAnimation();
    if (!(input === null || input === void 0 ? void 0 : input.classList.contains("recording"))) {
        chrome.tabCapture.capture({ audio: true }, function (stream) {
            if (stream) {
                var mediaRecorder_1 = new MediaRecorder(stream);
                mediaRecorder_1.start();
                input === null || input === void 0 ? void 0 : input.removeEventListener("click", startRecording);
                input === null || input === void 0 ? void 0 : input.addEventListener("click", function () { return stopRecording(mediaRecorder_1); });
            }
        });
    }
}
function stopRecording(mediaRecorder) {
    mediaRecorder.stop();
    // input?.removeEventListener("click", stopRecording);
    input === null || input === void 0 ? void 0 : input.addEventListener("click", startRecording);
}
