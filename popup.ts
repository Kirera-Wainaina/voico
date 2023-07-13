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

// set default recording state to off
chrome.storage.session.set({ 
  "recording": Recording.OFF, 
});

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
(async() => {
  await chrome.storage.session.set({ "user_media_is_setup": YesOrNo.NO })
})()

const input = document.querySelector("input");
input?.addEventListener("click", async () => {
  
  const tabId = await getCurrentTabId();
  if (typeof tabId === "number") {
    const state = await chrome.storage.session.get(null);
    await chrome.tabs.sendMessage(
      tabId, 
      { name: "record_click", content: state }
    );
  }
  toggleHintAndAnimation()
  changeRecordingState()
})

// show animation to let user know the recording has started
function toggleHintAndAnimation() : void {
  const hint = document.querySelector("p");
  hint?.classList.toggle("hide");

  const recordingAnimation = document.getElementById("recording-animation");
  recordingAnimation?.classList.toggle("hide");
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