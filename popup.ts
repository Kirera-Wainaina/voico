const input = document.querySelector("input");
input?.addEventListener("click", startRecording)

function toggleHintAndAnimation() : void {
  const hint = document.querySelector("p");
  hint?.classList.toggle("hide");

  const recordingAnimation = document.getElementById("recording-animation");
  recordingAnimation?.classList.toggle("hide");
}

function startRecording() : void {
  toggleHintAndAnimation()
  if (!input?.classList.contains("recording")) {
    chrome.tabCapture.capture({ audio: true }, (stream) => {
      if (stream) {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();
        input?.removeEventListener("click", startRecording);
        input?.addEventListener("click", () => stopRecording(mediaRecorder));    
      }
    })
  }
}

function stopRecording(mediaRecorder: MediaRecorder) : void {
  mediaRecorder.stop();
  // input?.removeEventListener("click", stopRecording);
  input?.addEventListener("click", startRecording);    

}