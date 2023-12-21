import Toggle from "./Toggle.js";
import changeRecordingState from "./changeRecordingState.js";
import enterTranscriptIntoTranscriptElement from "./enterTranscriptIntoTranscriptElement.js";
import showNotification from "./showNotification.js";

export default function (message: ChromeMessage) {

  switch (message.name) {
    case "transcript_received":
      Toggle.loadingIcon();
      saveTranscript(message.content);
      break;
  
    case "permission_denied":
      handlePermissionDenied();
      break;

    case "permission_granted":
      handlePermissionGranted();
      break;

    case "server_error":
      const errorNotification = document.getElementById("server-error");
      if (errorNotification) showNotification(errorNotification);
      Toggle.loadingIcon();
      break;

    case "is_online":
      handleWifiSituation(message.content)

    default:
      break;
  }
}


async function saveTranscript(text:string) {
  let { transcripts } = await chrome.storage.local.get("transcripts");

  if (transcripts) {
    transcripts = JSON.parse(transcripts);
    if (transcripts.length >= 5) {
      // maintain the saved transcripts at 5 or below
      // anything above is popped
      transcripts.pop();
    }
  } else {
    transcripts = [];
  }
  transcripts.unshift(text);
  await chrome.storage.local.set({ "transcripts": JSON.stringify(transcripts) });
  
  enterTranscriptIntoTranscriptElement();
}

async function handlePermissionDenied() {
  // restore state
  await chrome.storage.session.set({ 
    "user_media_is_setup": false,
    "recording": false,
    "permission_granted": false
  })
  // show the permission note
  Toggle.permissionNote()
}

async function handlePermissionGranted() {
  const { permission_granted } = await chrome.storage.session.get("permission_granted");

  // if permission was set, nothing to do
  if (permission_granted) return;

  await chrome.storage.session.set({ "permission_granted": true });
  await changeRecordingState()
  Toggle.recordingAnimation();
  Toggle.hint();  

  return ;
}

function handleWifiSituation(status: boolean) {
  if (status) return; // do nothing if there is wifi
  // show the no wifi icon
  Toggle.elementDisplay("no-wifi-icon");
  

  // hide the record button and hint
  Toggle.elementDisplay("mic");
  Toggle.elementDisplay("hint");
}