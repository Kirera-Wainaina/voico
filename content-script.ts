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
    const result = await setupRecording(content.language, content.APIKey);
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

async function setupRecording(language: string, APIKey: string) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    if (stream) {
      chrome.runtime.sendMessage({ name: "permission_granted" });
      const audioData: Array<Blob> = [];
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorder.addEventListener("stop", () => transmitAudio(audioData, language, APIKey));
      mediaRecorder.addEventListener("dataavailable", event => combineAudioData(event, audioData));
      return mediaRecorder
    }      
  } catch (error) {
    // user denied permission
    chrome.runtime.sendMessage({ name: "permission_denied" })
  }
  
}

function combineAudioData(event:BlobEvent, audioDataArray:Array<Blob>) {
  // remove the current blob in the array
  audioDataArray.pop();
  // enter the new blob. Only one blob will be in the array
  audioDataArray.push(event.data);
}

function transmitAudio(audioData:Blob[], language: string, APIKey: string) {
  const blob = new Blob(audioData, { type: "audio/webm;codecs=opus"});
  const formdata = new FormData();
  formdata.append("audio", blob);
  formdata.append("fileNumber", "1");
  formdata.append("language", language);
  formdata.append("APIKey", APIKey);

  // use 'cors' because the request isn't going to same origin
  // the server has allowed access through "access-control-allow-origin" header
  fetch("https://voico.ddns.net/api/transcribe", {
    method: "POST",
    body: formdata,
    mode: "cors"
  }).then(response => response.text())
  .then(text => {
    chrome.runtime.sendMessage({name: "transcript_received", content: text});
    inputTextIntoActiveElement(text)
  });

}

function inputTextIntoActiveElement(text:string) {
  const activeElement = document.activeElement;
  if (
    activeElement instanceof HTMLInputElement 
    || activeElement instanceof HTMLTextAreaElement
  ) {
    if (!activeElement.value) {
      activeElement.value = text;
    } else {
      // start new paragraph
      activeElement.value += `\n${text}`;
    }
  } else if (activeElement instanceof HTMLDivElement) {
    if (activeElement.getAttribute("contenteditable")) {
      if (!activeElement.innerText) {
        activeElement.innerText = text;
      } else {
      // start new paragraph
      activeElement.innerText += `\n${text}`;
      }
    }
  }
}