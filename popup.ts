// is the extension currently recording
enum Recording {
  YES = "yes",
  NO = "no"
}

const input = document.querySelector("input");
input?.addEventListener("click", () => {
  toggleHintAndAnimation();
  handleRecording(input)
});

function toggleHintAndAnimation() : void {
  const hint = document.querySelector("p");
  hint?.classList.toggle("hide");

  const recordingAnimation = document.getElementById("recording-animation");
  recordingAnimation?.classList.toggle("hide");
}

async function handleRecording(element:HTMLInputElement, existingMediaRecorder?: MediaRecorder) {

  // remove prior event listeners
  element?.replaceWith(element.cloneNode());

  if (!existingMediaRecorder) {
    // start recording
    removeAudioElement()
    await startRecording()  
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
  const blob = new Blob(audioData, { type: "audio/mp3; codecs=opus"});

  audioData = [];
  const audioUrl = window.URL.createObjectURL(blob);
  const audioElement = createAudioElement(audioUrl);
  const script = document.querySelector("script");
  script?.insertAdjacentElement("beforebegin", audioElement);
}

function combineAudioData(event:BlobEvent, audioDataArray:Array<Blob>) {
  audioDataArray.push(event?.data)
}

function createAudioElement(src: string) {
  const audioElement = new Audio("src");
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
      // Continue to play the captured audio to the user.
      const output = new AudioContext();
      const source = output.createMediaStreamSource(stream);
      source.connect(output.destination);
      
      const audioData: Array<Blob> = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();

      const input = document.querySelector("input");
      input?.addEventListener("click", () => handleRecording(input, mediaRecorder));

      mediaRecorder.addEventListener("stop", () => saveRecordedMedia(audioData));
      mediaRecorder.addEventListener("dataavailable", event => combineAudioData(event, audioData));
    }
  })
}