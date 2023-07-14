// so far I think I can get content scripts to work
/*
consider using the content script as an endpoint
all click events are relayed to it
Once it receives a click event,
  It'll check through storage api if user_media is set up
  if not: ask user for permission
  if yes: decided if to start or stop recording

  see if I can pass audio data through an event to popup file so an
  audio element is created
*/
var mediaRecorder: MediaRecorder | null = null;

chrome.runtime.onMessage.addListener(handleContentScriptMessages);

async function handleContentScriptMessages(message:Message) {
  if (message.name === "record_click") {
    await handleRecording(message.content);
  }
}

async function handleRecording(content: any) {
  
  // set up user media if it doesn't exist
  // this is the case for every first click on extension
  if (!content.user_media_is_setup || content.user_media_is_setup == "no") {
    const result = await setupRecording();
    if (result) {
      mediaRecorder = result;
      mediaRecorder.start()
    }
  } else if (content.recording === "off") {
    mediaRecorder?.start();
  } else {
    mediaRecorder?.stop();
  }

}

async function setupRecording() {
  
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  if (stream) {
    const audioData: Array<Blob> = [];
    const mediaRecorder = new MediaRecorder(stream);
    
    mediaRecorder.addEventListener("stop", () => transmitAudio(audioData));
    mediaRecorder.addEventListener("dataavailable", event => combineAudioData(event, audioData));
    return mediaRecorder
  }
}

function combineAudioData(event:BlobEvent, audioDataArray:Array<Blob>) {
  audioDataArray.unshift(event?.data)
}

function transmitAudio(audioData:Blob[]) {
  const blob = new Blob(audioData, { type: "audio/webm;codecs=opus"});
  const formdata = new FormData();
  formdata.append("audio", blob);
  formdata.append("fileNumber", "1");
  audioData = [];

  fetch("https://voico.ddns.net/api/transcribe", {
    method: "POST",
    body: formdata,
    mode: "cors"
  }).then(response => response.text())
  .then(text => {
    console.log(text);
    chrome.runtime.sendMessage({name: "transcript_received", content: text})
  });

}