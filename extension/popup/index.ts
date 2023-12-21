import Toggle from "./Toggle.js";
import changeRecordingState from "./changeRecordingState.js";
import enterTranscriptIntoTranscriptElement from "./enterTranscriptIntoTranscriptElement.js";
import handlePopupMessages from "./handlePopupMessages.js";
import showNotification from "./showNotification.js";

// listen to messages
chrome.runtime.onMessage.addListener(handlePopupMessages);


// set user_media_is_setup state to an initial value 'no'
// set default recording state to off
(async() => {
  await chrome.storage.session.set({ 
    "user_media_is_setup": false,
    "recording": false
  } as ISessionState)
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
  
  const sessionState: ISessionState = await chrome.storage.session.get(null);
  // get API KEY and language
  const localState = await chrome.storage.local.get(["APIKey", "language"]);
  await chrome.tabs.sendMessage(
    tabId, 
    { name: "record_click", content: {...sessionState, ...localState} }
  );
  
  if (sessionState.permission_granted) {
    // only applicable if user has granted permission
    Toggle.recordingAnimation();
    Toggle.hint();  
    await changeRecordingState()
  }
  handleLoadingIcon(sessionState.recording);
})

function getCurrentTabId() {
  return chrome.tabs.query({ active: true, currentWindow: true })
    .then(tabs => tabs[0].id)
}

function handleLoadingIcon(recordingState: boolean | undefined) {
  if (recordingState) {
    // recording is on, button is pressed to switch it off
    // show loading icon because audio is being processed
    Toggle.loadingIcon()
  }
}

const expandMore = document.getElementById("expand-more");
const expandLess = document.getElementById("expand-less");

expandMore?.addEventListener("click", () => {
  expandMore.classList.toggle("hide");
  expandLess?.classList.toggle("hide");

  enterTranscriptIntoTranscriptElement();
  Toggle.transcript();
})

expandLess?.addEventListener("click", () => {
  expandMore?.classList.toggle("hide");
  expandLess?.classList.toggle("hide");

  Toggle.transcript();
})

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