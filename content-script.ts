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
let mediaRecorder: MediaRecorder;

chrome.runtime.onMessage.addListener(handleContentScriptMessages);

function handleContentScriptMessages(message:Message) {
  if (message.name === "record_click") {
    handleRecording(message.content);
  }
}

async function handleRecording(content: any) {
  
  // set up user media if it doesn't exist
  // this is the case for every first click on extension
  if (!Object.keys(content).length) {
    const result = await setupRecording();
    if (result) mediaRecorder = result;
  }

}

async function setupRecording() {
  
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  if (stream) {
    const audioData: Array<Blob> = [];
    const mediaRecorder = new MediaRecorder(stream);
    
    mediaRecorder.addEventListener("stop", () => saveRecordedMedia(audioData));
    mediaRecorder.addEventListener("dataavailable", event => combineAudioData(event, audioData));
    return mediaRecorder
  }
}