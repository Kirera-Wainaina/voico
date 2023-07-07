var input = document.querySelector("input");
input === null || input === void 0 ? void 0 : input.addEventListener("click", function () { return handleRecording(); });
function toggleHintAndAnimation() {
    var hint = document.querySelector("p");
    hint === null || hint === void 0 ? void 0 : hint.classList.toggle("hide");
    var recordingAnimation = document.getElementById("recording-animation");
    recordingAnimation === null || recordingAnimation === void 0 ? void 0 : recordingAnimation.classList.toggle("hide");
}
function handleRecording(existingMediaRecorder) {
    toggleHintAndAnimation();
    input === null || input === void 0 ? void 0 : input.replaceWith(input.cloneNode());
    if (!existingMediaRecorder) {
        // start recording
        chrome.tabCapture.capture({ audio: true }, function (stream) {
            if (stream) {
                var mediaRecorder_1 = new MediaRecorder(stream);
                mediaRecorder_1.start();
                var input_1 = document.querySelector("input");
                input_1 === null || input_1 === void 0 ? void 0 : input_1.addEventListener("click", function () { return handleRecording(mediaRecorder_1); });
            }
        });
    }
    else {
        // stop recording
        existingMediaRecorder.stop();
        console.log(existingMediaRecorder.state);
        var input_2 = document.querySelector("input");
        input_2 === null || input_2 === void 0 ? void 0 : input_2.addEventListener("click", function () { return handleRecording(); });
    }
}
