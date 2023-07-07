const input = document.querySelector("input");
// input?.addEventListener("click", () => handleRecording(input));
input?.addEventListener("click", () => {
  handleRecording(input)
  console.log('recording...')
});

const audioContext = new AudioContext();

function toggleHintAndAnimation() : void {
  const hint = document.querySelector("p");
  hint?.classList.toggle("hide");

  const recordingAnimation = document.getElementById("recording-animation");
  recordingAnimation?.classList.toggle("hide");
}

function handleRecording(element:HTMLInputElement, existingMediaRecorder?: MediaRecorder) : void {
  toggleHintAndAnimation();

  // remove prior event listeners
  element?.replaceWith(element.cloneNode());

  if (!existingMediaRecorder) {
    // start recording
    removeAudioElement()
    startRecording()  
  } else {
    if (existingMediaRecorder.state == "inactive") {
      // restart recording
      existingMediaRecorder.start();
      removeAudioElement();
    } else {
      // stop recording
      existingMediaRecorder.stop();
    }
    const input = document.querySelector("input");
    input?.addEventListener("click", () => handleRecording(input, existingMediaRecorder))  
  }
}

function saveRecordedMedia(audioData: Array<Blob>) {
  console.log(audioData)
  const blob = new Blob(audioData, { type: "audio/webm;codecs=opus"});
  const audioUrl = URL.createObjectURL(blob);
  const audioElement = createAudioElement(audioUrl);
  const script = document.querySelector("script");
  script?.insertAdjacentElement("beforebegin", audioElement);
}

function combineAudioData(event:BlobEvent, audioDataArray:Array<Blob>) {
  audioDataArray.push(event?.data)
}

function createAudioElement(src: string) {
  const audioElement = document.createElement("audio");
  audioElement.setAttribute("controls", "");
  audioElement.setAttribute("src", src);
  return audioElement
}

function removeAudioElement() : void {
  const audioElement = document.querySelector("audio");
  if (audioElement) {
    audioElement.remove();
  }
}

function startRecording() {
  chrome.tabCapture.capture({ audio: true }, (stream) => {
    if (stream) {
      const audioData: Array<Blob> = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();

      const input = document.querySelector("input");
      console.log(input)
      input?.addEventListener("click", () => handleRecording(input, mediaRecorder));

      mediaRecorder.addEventListener("stop", () => saveRecordedMedia(audioData));
      mediaRecorder.addEventListener("dataavailable", event => combineAudioData(event, audioData));
    }
  })
}