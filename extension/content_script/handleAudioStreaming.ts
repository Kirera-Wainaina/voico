var mediaRecorder: MediaRecorder | null = null;
var webSocket: WebSocket | null = null;

chrome.runtime.onMessage.addListener(handleMessagesOnStreaming);

function handleMessagesOnStreaming(message: ChromeMessage) {

  // don't run anything if streaming is off
  if (message.content && !message.content.enabledStreaming) return;

  if (message.name == "record_click") { // user clicked to start/stop recording
    handleStreaming(message.content)
  }
}

async function handleStreaming(content:ILocalState & ISessionState) {
}