chrome.runtime.onMessage.addListener(handleMessagesOnStreaming);

function handleMessagesOnStreaming(message: ChromeMessage) {

  // don't run anything if streaming is off
  if (message.content && !message.content.enabledStreaming) return;

  if (message.name == "record_click") {
    handleStreaming(message.content)
  }
}

async function handleStreaming(content: ILocalState & ISessionState) {
  try {
    if (!content.user_media_is_setup) { // initial state where we don't have permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
     if (stream) {
      // console.log(content)
      chrome.runtime.sendMessage({ name: "permission_granted" });
      const peerConnection = new RTCPeerConnection();
      // const rtcSender = peerConnection.addTrack(stream.getAudioTracks()[0]);
      stream.getAudioTracks().forEach(track => peerConnection.addTrack(track, stream));
      const sessionDescription = await peerConnection.createOffer();
      console.log(sessionDescription)
      await peerConnection.setLocalDescription(sessionDescription);
      // peerConnection.createDataChannel('food')
      console.log("ran up to this point")
     }
    }  else { // stop the streaming

    }    
  } catch (error) {
    console.log(error)
    // user denied permission
    chrome.runtime.sendMessage({ name: "permission_denied" })
  }
}