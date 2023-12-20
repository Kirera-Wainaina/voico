import toggleElementDisplay from "./toggleElementDisplay.js";
import toggleHint from "./toggleHint.js";
import toggleLoadingIcon from "./toggleLoadingIcon.js";
import togglePermissionNote from "./togglePermissionNote.js";
import toggleRecordingAnimation from "./toggleRecordingAnimation.js";
import toggleTranscript from "./toggleTranscript.js";

// save recording state to know if click should start/stop recording
enum Recording {
  ON = "on",
  OFF = "off"
}

// state to know if we should initiate getUserMedia for the first time
enum YesOrNo {
  YES = "yes",
  NO = "no"
}

// listen to messages
chrome.runtime.onMessage.addListener(handlePopupMessages);

function handlePopupMessages(message: ChromeMessage) {

  switch (message.name) {
    case "transcript_received":
      toggleLoadingIcon();
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
      toggleLoadingIcon();
      break;

    case "is_online":
      handleWifiSituation(message.content)

    default:
      break;
  }
}

// set user_media_is_setup state to an initial value 'no'
// set default recording state to off
(async() => {
  await chrome.storage.session.set({ 
    "user_media_is_setup": YesOrNo.NO,
    "recording": Recording.OFF
  })
})();

// check if there is an API KEY
// send user to option page to set it if there is none
(async () => {
  const { APIKey } = await chrome.storage.local.get("APIKey");
  if (!APIKey) chrome.runtime.openOptionsPage();
})();

(async () => {
  const tabId = await getCurrentTabId();
  if (!tabId) return // no tab id, no action

  await chrome.tabs.sendMessage(tabId, { name: "wifi_check" })
})();

const input = document.querySelector("input");
input?.addEventListener("click", async () => {
  
  const tabId = await getCurrentTabId();
  if (!tabId) return // no tab id, no action
  
  const state = await chrome.storage.session.get(null);
  // get API KEY and language
  const state2 = await chrome.storage.local.get(["APIKey", "language"]);
  await chrome.tabs.sendMessage(
    tabId, 
    { name: "record_click", content: {...state, ...state2} }
  );
  
  if (state.permission_granted == YesOrNo.YES) {
    // only applicable if user has granted permission
    toggleRecordingAnimation();
    toggleHint();  
    await changeRecordingState()
  }
  handleLoadingIcon(state.recording);
})

async function changeRecordingState() {
  const { recording } = await chrome.storage.session.get("recording");
  if (recording == "off") {
    chrome.storage.session.set({ 
      "recording": Recording.ON,
      "user_media_is_setup": YesOrNo.YES
    });
  } else {
    chrome.storage.session.set({ "recording": Recording.OFF });
  }
}

function getCurrentTabId() {
  return chrome.tabs.query({ active: true, currentWindow: true })
    .then(tabs => tabs[0].id)
}

function handleLoadingIcon(recordingState: Recording) {
  if (recordingState == Recording.ON) {
    // recording is on, button is pressed to switch it off
    // show loading icon because audio is being processed
    toggleLoadingIcon()
  }
}

async function handlePermissionDenied() {
  // restore state
  await chrome.storage.session.set({ 
    "user_media_is_setup": YesOrNo.NO,
    "recording": Recording.OFF,
    "permission_granted": YesOrNo.NO
  })
  // show the permission note
  togglePermissionNote()
}

async function handlePermissionGranted() {
  const { permission_granted } = await chrome.storage.session.get("permission_granted");

  // if permission was set, nothing to do
  if (permission_granted == YesOrNo.YES) return;

  await chrome.storage.session.set({ "permission_granted": YesOrNo.YES});
  await changeRecordingState()
  toggleRecordingAnimation();
  toggleHint();  

  return ;
}

const expandMore = document.getElementById("expand-more");
const expandLess = document.getElementById("expand-less");

expandMore?.addEventListener("click", () => {
  expandMore.classList.toggle("hide");
  expandLess?.classList.toggle("hide");

  enterTranscriptIntoTranscriptElement();
  toggleTranscript();
})

expandLess?.addEventListener("click", () => {
  expandMore?.classList.toggle("hide");
  expandLess?.classList.toggle("hide");

  toggleTranscript();
})

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

async function enterTranscriptIntoTranscriptElement() {
  let { transcripts } = await chrome.storage.local.get("transcripts");
  const transcriptElement = document.getElementById("transcript");

  if (transcripts && transcriptElement) {
    transcripts = JSON.parse(transcripts);
    transcriptElement.textContent = transcripts[0];
  } else if (!transcripts && transcriptElement) {
    transcriptElement.textContent = "no transcripts yet!"
  }  
}

const copyIcon = document.getElementById("copy-icon");
copyIcon?.addEventListener("click", copyTranscriptToClipboard);

async function copyTranscriptToClipboard() {
  const transcriptElement = document.getElementById("transcript");
  const transcriptContent = transcriptElement?.textContent;

  if (typeof transcriptContent == 'string') {
    await navigator.clipboard.writeText(transcriptContent)    
  }

  const copiedNotification = document.getElementById("copied-notification");
  if (copiedNotification) showNotification(copiedNotification)
}

function showNotification(element: HTMLElement) {
  element?.classList.toggle("hide");
  element?.classList.toggle("notify");

  // hide the notification again
  element?.addEventListener("animationend", () => {
    element?.classList.toggle("hide");
    element?.classList.toggle("notify");
  })
}

const nextIcon = document.getElementById("next-icon");
nextIcon?.addEventListener("click", showNextTranscript);

async function showNextTranscript() {
  let { transcripts } = await chrome.storage.local.get("transcripts");
  if (!transcripts) {
    return
  }
  const transcriptsArray: string[] = JSON.parse(transcripts);

  const transcriptElement = document.getElementById("transcript");
  const currentTranscript = transcriptElement?.textContent;

  if (!currentTranscript) return;

  const index = transcriptsArray
    .findIndex(transcript => transcript === currentTranscript);
  const nextIndex = (index + 1) >= transcriptsArray.length ? 0 : index + 1;

  transcriptElement.textContent = transcriptsArray[nextIndex];

  adjustTranscriptNumber(nextIndex);
}

const previousIcon = document.getElementById("previous-icon");
previousIcon?.addEventListener("click", showPreviousTranscript);

async function showPreviousTranscript() {
  let { transcripts } = await chrome.storage.local.get("transcripts");
  if (!transcripts) {
    return
  }

  const transcriptsArray: string[] = JSON.parse(transcripts);

  const transcriptElement = document.getElementById("transcript");
  const currentTranscript = transcriptElement?.textContent;

  if (!currentTranscript) return;

  const index = transcriptsArray
  .findIndex(transcript => transcript === currentTranscript);
  const previousIndex = (index - 1) < 0 ? transcriptsArray.length - 1 : index - 1;

  transcriptElement.textContent = transcriptsArray[previousIndex];

  adjustTranscriptNumber(previousIndex);
}

function adjustTranscriptNumber(newIndex:number) {
  // let the user know which transcript they are looking at out of 5
  const transcriptNumberElement = document.getElementById("transcript-number");
  let transcriptNumber = newIndex + 1;

  if (transcriptNumberElement) {
    transcriptNumberElement.textContent = `${transcriptNumber} / 5`;
  }

}

const settingsIcon = document.getElementById("settings-icon");
settingsIcon?.addEventListener("click", navigateToOptionsPage);

async function navigateToOptionsPage() {
  await chrome.runtime.openOptionsPage()
}

function handleWifiSituation(status: boolean) {
  if (status) return; // do nothing if there is wifi
  // show the no wifi icon
  toggleElementDisplay("no-wifi-icon");

  // hide the record button and hint
  toggleElementDisplay("mic");
  toggleElementDisplay("hint");
}