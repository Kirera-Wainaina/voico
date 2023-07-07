const input = document.querySelector("input");
input?.addEventListener("click", () => handleRecording())

function toggleHintAndAnimation() : void {
  const hint = document.querySelector("p");
  hint?.classList.toggle("hide");

  const recordingAnimation = document.getElementById("recording-animation");
  recordingAnimation?.classList.toggle("hide");
}

function handleRecording(existingMediaRecorder?: MediaRecorder) : void {
  toggleHintAndAnimation();

  input?.replaceWith(input.cloneNode());

  if (!existingMediaRecorder) {
    // start recording
    chrome.tabCapture.capture({ audio: true }, (stream) => {
      if (stream) {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();

        const input = document.querySelector("input");
        input?.addEventListener("click", () => handleRecording(mediaRecorder));

      }
    })  
  } else {
    // stop recording
    existingMediaRecorder.stop();
    console.log(existingMediaRecorder.state)
    const input = document.querySelector("input");
    input?.addEventListener("click", () => handleRecording())
  }
}