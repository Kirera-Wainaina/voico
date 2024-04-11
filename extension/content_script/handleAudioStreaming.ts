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
  if (!content.user_media_is_setup) {
    setupWebSocket()
  } else if (content.recording) {
    mediaRecorder?.stop()
  }
}

async function setupWebSocket() {
  // import env dynamically
  const envUrl = chrome.runtime.getURL("/env.js");
  const env = await import(envUrl);

  if (!webSocket) {
    webSocket = new WebSocket(`${env.default.webSocketURL}`, ['echo-protocol']);
  }

  webSocket.onopen = async (event) => {
    console.log('websocket open');

    // start recording once web socket is open
    await startRecording()
  };

  webSocket.onmessage = (event) => {
    // console.log(event.data);
    inputTextStreamIntoActiveElement(event.data)
  };

  webSocket.onclose = (event) => {
    console.log('websocket connection closed');
    webSocket = null;
  };
}

async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    if (stream) {
      chrome.runtime.sendMessage({ name: "permission_granted" });
      mediaRecorder = new MediaRecorder(stream);

      // send data to the server
      mediaRecorder.addEventListener(
        'dataavailable', 
        event => webSocket?.send(new Blob([event.data], { type: "audio/webm;codecs=opus"}))
      );

      mediaRecorder.start(2000);
    }
  } catch (error) {
    // user denied permission
    chrome.runtime.sendMessage({ name: "permission_denied" })
  }
}

function inputTextStreamIntoActiveElement(text: string) {
  const activeElement = document.activeElement;

  if ( // check for elements that are editable
    activeElement instanceof HTMLInputElement || 
    activeElement instanceof HTMLTextAreaElement
  ) {
    if (!activeElement.value) {
      activeElement.value = text;
    } else {
      activeElement.value += text;
    }
  } else if (
    activeElement instanceof HTMLDivElement && 
    activeElement.hasAttribute('contenteditable')
  ) {
    if (!activeElement.innerText) {
      activeElement.innerText = text;
    } else {
      activeElement.innerText += text;
    }
  }
}