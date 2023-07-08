// save recording state to know if click should start/stop recording
enum Recording {
  ON = "on",
  OFF = "off"
}

// getUserMedia needs to work through the offscreen html file
// create offscreen document to get permission to operate the api
chrome.offscreen.createDocument({
  url: "offscreen-recording.html",
  reasons: [chrome.offscreen.Reason.USER_MEDIA],
  justification: "Record audio for transcription"
});

// set default recording state to off
chrome.storage.session.set({ "recording": Recording.OFF });

const input = document.querySelector("input");
input?.addEventListener("click", () => {
  triggerRecordingThroughOffscreenDocument()
  toggleHintAndAnimation
})

async function triggerRecordingThroughOffscreenDocument() {
  // send message to offscreen to start recording
  await chrome.runtime.sendMessage("handle-recording");
}

// show animation to let user know the recording has started
function toggleHintAndAnimation() : void {
  const hint = document.querySelector("p");
  hint?.classList.toggle("hide");

  const recordingAnimation = document.getElementById("recording-animation");
  recordingAnimation?.classList.toggle("hide");
}