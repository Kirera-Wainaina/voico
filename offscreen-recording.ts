type State = {
  recorded_before: string,
  recording: string
}

chrome.runtime.onMessage.addListener(handleRecording);


async function handleRecording(message: State, sender: any, sendResponse: Function) {
  const { recording, recorded_before } = message;

  if (recording == "off" && recorded_before == "no") {
    // this is the first time recording
    // set up recorder
    await startRecording()
  }
}

async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true})
    const audioData: Array<Blob> = [];
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start();
  
    mediaRecorder.addEventListener("stop", () => saveRecordedMedia(audioData));
    mediaRecorder.addEventListener("dataavailable", event => combineAudioData(event, audioData));
      
  } catch (error) {
    console.log(error)
  }
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

function removeAudioElement() : void {
  const audioElement = document.querySelector("audio");
  if (audioElement) {
    audioElement.remove();
  }
}

function saveRecordedMedia(audioData: Array<Blob>) {
  const blob = new Blob(audioData, { type: "audio/mp3; codecs=opus"});

  audioData = [];
  const audioUrl = window.URL.createObjectURL(blob);
  return audioUrl
  // const audioElement = createAudioElement(audioUrl);
  // const script = document.querySelector("script");
  // script?.insertAdjacentElement("beforebegin", audioElement);
}

function combineAudioData(event:BlobEvent, audioDataArray:Array<Blob>) {
  audioDataArray.push(event?.data)
}