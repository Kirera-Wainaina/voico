/*
 * this is where audio is recorded and transmitted to the server
*/

var mediaRecorder: MediaRecorder | null = null;

chrome.runtime.onMessage.addListener(handleMessagesOnRecording);

async function handleMessagesOnRecording(message: ChromeMessage) {
  // don't run this script if streaming is enabled
  if (message.content && message.content.enabledStreaming) return;

  if (message.name == "record_click") {
    await handleRecording(message.content);
  }
  
}

async function handleRecording(content: ISessionState & ILocalState) {
  
  // set up user media if it doesn't exist
  // this is the case for every first click on extension
  if (!content.user_media_is_setup && content.recordingLanguage && content.APIKey) {
    const result = await setupRecording(content.recordingLanguage, content.APIKey);
    if (result) {
      mediaRecorder = result;
      mediaRecorder.start()
    }
  } else if (!content.recording) {
    mediaRecorder?.start();
  } else {
    mediaRecorder?.stop();
  }

}

async function setupRecording(recordingLanguage: string, APIKey: string) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    if (stream) {
      chrome.runtime.sendMessage({ name: "permission_granted" });
      const audioData: Array<Blob> = [];
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorder.addEventListener("stop", () => transmitAudio(audioData, recordingLanguage, APIKey));
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

async function transmitAudio(audioData:Blob[], recordingLanguage: string, APIKey: string) {
  const blob = new Blob(audioData, { type: "audio/webm;codecs=opus"});
  const formdata = new FormData();
  formdata.append("audio", blob);
  formdata.append("fileNumber", "1");
  formdata.append("language", recordingLanguage);
  formdata.append("APIKey", APIKey);

  // import env dynamically
  const envUrl = chrome.runtime.getURL("/env.js");
  const env = await import(envUrl);

  // use 'cors' because the request isn't going to same origin
  // the server has allowed access through "access-control-allow-origin" header
  fetch(`${env.default.domain}/api/transcribe`, {
    method: "POST",
    body: formdata,
    mode: "cors"
  })
  .then(response => {
    if (response.status == 500) throw new Error("server error");
    return response.text()
  })
  .then(text => {
    chrome.runtime.sendMessage({name: "transcript_received", content: text});
    inputTextIntoActiveElement(text)
  })
  .catch(error => {
    // let the user know there is an error through the popup
    chrome.runtime.sendMessage({ name: "server_error" });
  })

}

function inputTextIntoActiveElement(text:string) {
  const activeElement = document.activeElement;
  if (
    activeElement instanceof HTMLInputElement || 
    activeElement instanceof HTMLTextAreaElement
  ) {
    if (!activeElement.value) {
      activeElement.value = text;
    } else {
      // start new paragraph
      activeElement.value += `\n${text}`;
    }
  } else if (
    activeElement instanceof HTMLDivElement && 
    activeElement.hasAttribute("contenteditable")
  ) {
    if (!activeElement.innerText) {
      activeElement.innerText = text;
    } else {
      // start new paragraph
      activeElement.innerText += `\n${text}`;
    }
  }
}