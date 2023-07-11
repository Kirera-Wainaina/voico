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

// check if offscreen exists to set default value
// if it doesn't then it's first time popup is clicked

// chrome.storage.session.get("offscreen_exists", async ({ offscreen_exists }) => {
//   if (offscreen_exists == "no" || !offscreen_exists) {
//     // set initial values
//     await chrome.storage.session.set({ 
//       "offscreen_exists": YesOrNo.YES,
//       "recorded_before": YesOrNo.NO,
//     });
  
//     // getUserMedia needs to work through the offscreen html file
//     // create offscreen document to get permission to operate the api
//     const tabId = await getCurrentTabId();
//     if (typeof tabId === "number") {
//       chrome.scripting.executeScript({
//         target: { tabId },
//         func: hasUserMediaPermission
//       }).then(async feedback => {
//         // hasUserMediaPermission will return true if granted permission
//         if (feedback[0].result) {
//           await chrome.offscreen.createDocument({
//             url: "offscreen-recording.html",
//             reasons: [chrome.offscreen.Reason.USER_MEDIA],
//             justification: "Record audio for transcription"
//           });
//         }
//       })
//     }

//   }
// });



chrome.runtime.onMessage.addListener(handleMessages)

let mediaRecorder: MediaRecorder;
const input = document.querySelector("input");
input?.addEventListener("click", async () => {
  // await triggerRecordingThroughOffscreenDocument();

  // check if we asked for user permission
  // if not: ask for permission and setup mediaRecorder
  const {user_media_is_setup, recording } = await chrome.storage.session.get(
    ["user_media_is_setup", "recording"]
  );
  if (user_media_is_setup == "no" || !user_media_is_setup) {
    await chrome.storage.session.set({
      "user_media_is_setup": YesOrNo.YES
    });
    await setupRecording()
    removeAudioElement()
  } else if (recording == "off") {
    // we already asked for permission but the recorder is off
    mediaRecorder.start();
    removeAudioElement()
  } else {
    // the recorder is on, so we stop it.
    mediaRecorder.stop()
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

async function getUserMediaStream() {
  // run function as content script in order to acquire user permission

  // local function calling the getUserMedia method
  function getStream() {
    return navigator.mediaDevices.getUserMedia({ audio: true })
    .then((stream: MediaStream) => {
      return stream;
    })
  }

  const tabId = await getCurrentTabId();
  if (typeof tabId == "number") {
    return chrome.scripting.executeScript({
      target: {tabId},
      func: getStream
    }).then(feedback => {
      if (feedback) {
        // the stream is in the result property
        return feedback[0].result
      }
    })
  }

  
}

function getCurrentTabId() {
  return chrome.tabs.query({ active: true, currentWindow: true })
    .then(tabs => tabs[0].id)
}

async function setupRecording() {
  
  const stream = await getUserMediaStream();
  if (stream) {
    const audioData: Array<Blob> = [];
    const mediaRecorder = new MediaRecorder(stream);
    
    mediaRecorder.addEventListener("stop", () => saveRecordedMedia(audioData));
    mediaRecorder.addEventListener("dataavailable", event => combineAudioData(event, audioData));
    return mediaRecorder
  }
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