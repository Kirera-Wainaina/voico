type State = {
  recorded_before: string,
  recording: string
}

chrome.runtime.onMessage.addListener(handleOffscreenMessages);

function handleOffscreenMessages(message: Message) {
  if (message.name == "state") {
    handleRecording(message.content);
  }
}

async function handleRecording(content: any) {
  let mediaRecorder: any = null;
  const { recording, recorded_before } = content;
  if (recording == "off" && recorded_before == "no") {
    // this is the first time recording
    // set up recorder
    const result = await startRecording();
    if (result) mediaRecorder = result;
  } else if (recording == "off" && recorded_before == "yes"){
    // media recorder has already been set up 
    if (mediaRecorder) mediaRecorder.start()
  } else {
    // recording is on and its time to pause
    if (mediaRecorder) mediaRecorder.stop();
  }

}

async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true})
    const audioData: Array<Blob> = [];
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start();
  
    // mediaRecorder.addEventListener("stop", () => saveRecordedMedia(audioData));
    mediaRecorder.addEventListener("stop", () => handleDataSaving(audioData));
    mediaRecorder.addEventListener("dataavailable", event => combineAudioData(event, audioData));
    return mediaRecorder
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

function handleDataSaving(audioData: Array<Blob>) {
  const audioUrl = saveRecordedMedia(audioData);

  chrome.runtime.sendMessage({ name: "audioUrl", content: audioUrl });
}

function saveRecordedMedia(audioData: Array<Blob>) {
  const blob = new Blob(audioData, { type: "audio/webm;codecs=opus"});

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