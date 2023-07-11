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
  content: any
}

// set default recording state to off
chrome.storage.session.set({ 
  "recording": Recording.OFF, 
});

// check if offscreen exists to set default value
// if it doesn't then it's first time popup is clicked
chrome.storage.session.get("offscreen_exists", ({ offscreen_exists }) => {
  if (offscreen_exists == "no" || !offscreen_exists) {
    // set initial values
    chrome.storage.session.set({ 
      "offscreen_exists": YesOrNo.YES,
      "recorded_before": YesOrNo.NO,
    });
  
    // getUserMedia needs to work through the offscreen html file
    // create offscreen document to get permission to operate the api
    chrome.offscreen.createDocument({
      url: "offscreen-recording.html",
      reasons: [chrome.offscreen.Reason.USER_MEDIA],
      justification: "Record audio for transcription"
    });
  }
});

chrome.runtime.onMessage.addListener(handleMessages)


const input = document.querySelector("input");
input?.addEventListener("click", async () => {
  await triggerRecordingThroughOffscreenDocument()
  toggleHintAndAnimation()
  changeRecordingState()
})

async function triggerRecordingThroughOffscreenDocument() {
  // send message to offscreen to start recording
  const state = await chrome.storage.session.get(["recording", "recorded_before"]);
  const response = await chrome.runtime.sendMessage({ name: "state", ...state });
}

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
      "recorded_before": YesOrNo.YES 
    });
  } else {
    chrome.storage.session.set({ "recording": Recording.OFF });
  }
}

function createAudioElement(src: string) {
  const audioElement = new Audio("src");
  audioElement.setAttribute("controls", "");
  audioElement.setAttribute("src", src);
  return audioElement
}

function handleMessages(message: {name: string, content: any}) {
  if (message.name == )
}