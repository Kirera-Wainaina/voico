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

type Message = {
  name: string,
  content?: any
}

// listen to messages
chrome.runtime.onMessage.addListener(handlePopupMessages);

function handlePopupMessages(message:Message) {

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
})()

const input = document.querySelector("input");
input?.addEventListener("click", async () => {
  
  const tabId = await getCurrentTabId();
  if (!tabId) return // no tab id, no action
  
  const state = await chrome.storage.session.get(null);
  await chrome.tabs.sendMessage(
    tabId, 
    { name: "record_click", content: state }
  );
  
  if (state.permission_granted == YesOrNo.YES) {
    // only applicable if user has granted permission
    toggleRecordingAnimation();
    toggleHint();  
    await changeRecordingState()
  }
  handleLoadingIcon(state.recording);
})

// show animation to let user know the recording has started
function toggleRecordingAnimation() : void {
  const recordingAnimation = document.getElementById("recording-animation");
  recordingAnimation?.classList.toggle("hide");
}

function toggleHint() {
  const hint = document.querySelector("p");
  hint?.classList.toggle("hide");  
}

function togglePermissionNote() {
  const note = document.getElementById("permission-note");
  note?.classList.toggle("hide");
}

function toggleTranscript() {
  const transcript = document.getElementById("transcript");
  transcript?.classList.toggle("hide");
}

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

function toggleLoadingIcon() {
  const input = document.querySelector("input");
  input?.classList.toggle("hide");

  const hint = document.getElementById("hint");
  hint?.classList.toggle("hide");

  // display the loading icon
  const spinner = document.getElementById("spinner");
  spinner?.classList.toggle("hide")

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
  transcripts = JSON.parse(transcripts);

  const transcriptElement = document.getElementById("transcript");
  if (transcriptElement) {
    const transcriptText = transcripts.length ? transcripts[0] : 'no transcripts yet!'
    transcriptElement.textContent = transcriptText;    
  }  
}