const input = document.querySelector("input");
input?.addEventListener("click", triggerRecordingThroughOffscreenDocument)

// getUserMedia needs to work through the offscreen html file
// create offscreen document to get permission to operate the api
chrome.offscreen.createDocument({
  url: "offscreen-recording.html",
  reasons: [chrome.offscreen.Reason.USER_MEDIA],
  justification: "Record audio for transcription"
});

async function triggerRecordingThroughOffscreenDocument() {
  // send message to offscreen to start recording
  await chrome.runtime.sendMessage("handle-recording");
}