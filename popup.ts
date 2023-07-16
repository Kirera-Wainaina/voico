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

// load the recording content script to ensure it loads
// prevents the error: could not establish connection
(async () => {
  const tabId = await getCurrentTabId();
  
  if (typeof tabId === "number") {
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ["content-script.js"]
    })
  }
})();

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
  
  // handle loading icon
  handleLoadingIcon(state.recording);
  toggleRecordingAnimation();
  toggleHint();
  changeRecordingState()
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

function handlePopupMessages(message:Message) {
  if (message.name == "transcript_received") {
    toggleLoadingIcon();
  } else if(message.name == "permission_denied") {
    handlePermissionDenied()
  }
}

async function handlePermissionDenied() {
  // restore state
  await chrome.storage.session.set({ 
    "user_media_is_setup": YesOrNo.NO,
    "recording": Recording.OFF
  })

}