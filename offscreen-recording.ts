type State = {
  recorded_before: string,
  recording: string
}

chrome.runtime.onMessage.addListener(handleOffscreenMessages);

async function handleOffscreenMessages(message: Message) {
  console.log("called")
  if (message.name == "recording_state") {
    await handleRecording(message.content);
  }
}

async function handleRecording(content: any) {
  let mediaRecorder: any = null;
  const { recording, recorded_before } = content;
  if (recording == "off" && recorded_before == "no") {
    // this is the first time recording
    // set up recorder
    const result = await setupRecording();
    if (result) {
      mediaRecorder = result;
      mediaRecorder.start()
    };
    handleAudioElementRemoval()
  } else if (recording == "off" && recorded_before == "yes"){
    // media recorder has already been set up 
    if (mediaRecorder) mediaRecorder.start();
    handleAudioElementRemoval()
  } else {
    // recording is on and its time to pause
    if (mediaRecorder) mediaRecorder.stop();
  }

}

async function setupRecording() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true})
  const audioData: Array<Blob> = [];
  const mediaRecorder = new MediaRecorder(stream);
  
  mediaRecorder.addEventListener("stop", () => handleDataSaving(audioData));
  // console.error("hello")
  mediaRecorder.addEventListener("dataavailable", event => combineAudioData(event, audioData));
  return mediaRecorder
}

async function handleDataSaving(audioData: Array<Blob>) {
  const audioUrl = saveRecordedMedia(audioData);

  await chrome.runtime.sendMessage({ name: "audioUrl", content: audioUrl });
  return
}

function saveRecordedMedia(audioData: Array<Blob>) {
  const blob = new Blob(audioData, { type: "audio/webm;codecs=opus"});

  audioData = [];
  const audioUrl = window.URL.createObjectURL(blob);
  return audioUrl
}

function combineAudioData(event:BlobEvent, audioDataArray:Array<Blob>) {
  audioDataArray.push(event?.data)
}

function handleAudioElementRemoval() {
  chrome.runtime.sendMessage({ name: "remove-audio-element" })
}