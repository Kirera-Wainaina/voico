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


chrome.runtime.onMessage.addListener(handleMessages)

// let mediaRecorder: MediaRecorder;
const input = document.querySelector("input");
input?.addEventListener("click", async () => {
  // await triggerRecordingThroughOffscreenDocument();

  // check if we asked for user permission
  // if not: ask for permission and setup mediaRecorder
  // const {user_media_is_setup, recording } = await chrome.storage.session.get(
  //   ["user_media_is_setup", "recording"]
  // );
  // if (user_media_is_setup == "no" || !user_media_is_setup) {
  //   await chrome.storage.session.set({
  //     "user_media_is_setup": YesOrNo.YES
  //   });
  //   await setupRecording()
  //   removeAudioElement()
  // } else if (recording == "off") {
  //   // we already asked for permission but the recorder is off
  //   mediaRecorder.start();
  //   removeAudioElement()
  // } else {
  //   // the recorder is on, so we stop it.
  //   mediaRecorder.stop()
  // }
  
  const tabId = await getCurrentTabId();
  if (typeof tabId === "number") {
    const state = await chrome.storage.session.get(null);
    await chrome.tabs.sendMessage(
      tabId, 
      { name: "record_click", content: state }
    )
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

function handleMessages(message: Message) {
  console.log(message, "received")
  if (message.name == "audioUrl") {
    displayAudioElement(message.content)
  } else if (message.name == "remove-audio-element") {
    removeAudioElement()
  }
}

function displayAudioElement(audioUrl:string) {
  const audioElement = createAudioElement(audioUrl);
  const script = document.querySelector("script");
  script?.insertAdjacentElement("beforebegin", audioElement);
}

function removeAudioElement() : void {
  const audioElement = document.querySelector("audio");
  if (audioElement) {
    audioElement.remove();
  }
}

// async function getUserMediaStream() {
//   // run function as content script in order to acquire user permission

//   // local function calling the getUserMedia method
//   async function getStream() {
//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
//     return stream
//   }

//   const tabId = await getCurrentTabId();
//   if (typeof tabId == "number") {
//     return chrome.scripting.executeScript({
//       target: {tabId},
//       func: getStream
//     }).then(([feedback]) => {
//       console.log(feedback)
//       if (feedback.result) {
//         // the stream is in the result property
//         return feedback.result
//       }
//     })
//   }

  
// }

function getCurrentTabId() {
  return chrome.tabs.query({ active: true, lastFocusedWindow: true })
    .then(tabs => tabs[0].id)
}


function saveRecordedMedia(audioData: Array<Blob>) {
  const blob = new Blob(audioData, { type: "audio/webm;codecs=opus"});

  audioData = [];
  const audioUrl = window.URL.createObjectURL(blob);
  displayAudioElement(audioUrl)
  // return audioUrl
  return
}


function combineAudioData(event:BlobEvent, audioDataArray:Array<Blob>) {
  audioDataArray.push(event?.data)
}