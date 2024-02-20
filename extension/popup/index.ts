import Toggle from "./Toggle.js";
import copyTranscriptToClipboard from "./copyTranscriptToClipboard.js";
import enterTranscriptIntoTranscriptElement from "./enterTranscriptIntoTranscriptElement.js";
import getCurrentTabId from "./getCurrentTabId.js";
import handlePopupMessages from "./handlePopupMessages.js";
import handleRecordingClick from "./handleRecordingClick.js";
import showNextTranscript from "./showNextTranscript.js";
import showPreviousTranscript from "./showPreviousTranscript.js";

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
input?.addEventListener("click", handleRecordingClick);
input?.addEventListener("pointerover", () => Toggle.hint());
input?.addEventListener("pointerleave", () => Toggle.hint());

const copyIcon = document.getElementById("copy-icon");
copyIcon?.addEventListener("click", copyTranscriptToClipboard);

const nextIcon = document.getElementById("next-icon");
nextIcon?.addEventListener("click", showNextTranscript);

const previousIcon = document.getElementById("previous-icon");
previousIcon?.addEventListener("click", showPreviousTranscript);

const settingsIcon = document.getElementById("settings-icon");
settingsIcon?.addEventListener("click", navigateToOptionsPage);

async function navigateToOptionsPage() {
  await chrome.runtime.openOptionsPage()
}

// add a data attribute to the input element with the ids of other pages
// a listener to each that removes an existing page and puts a new one
const navBarInputs = document.querySelectorAll("#nav-bar input");
navBarInputs.forEach(input => {
  // skip the process for the settings icon
  if (input instanceof HTMLElement && input.id == "settings-icon") {
    return
  }
  // set click event listener for each input
  input.addEventListener("click", () => {
    // hide page associated with each button
    navBarInputs.forEach(button => {
      if (button instanceof HTMLElement && button.dataset.id) {
        const page = document.getElementById(button.dataset.id);
        page?.classList.add("hide")
      }
    })
    // display the page associated with the input clicked
    if (input instanceof HTMLElement && input.dataset.id) {
      const page = document.getElementById(input.dataset.id);
      page?.classList.remove("hide");

      // enter transcript information if its transcript button
      if (input.dataset.id == "transcript-page") {
        enterTranscriptIntoTranscriptElement()
      }
    }
  })
})