import env from "../env.js";
import Toggle from "./Toggle.js";
import copyTranscriptToClipboard from "./copyTranscriptToClipboard.js";
import getCurrentTabId from "./getCurrentTabId.js";
import handlePopupMessages from "./handlePopupMessages.js";
import handlePopupPageChange from "./handlePopupPageChange.js";
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

const signinButton = document.getElementById("sign-in");
signinButton?.addEventListener("click", async () => {

  const tokenResult = await chrome.identity.getAuthToken({interactive: true});
  let result = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${tokenResult.token}`,
      'content-type': 'application/json '
    }
  })
  result = await result.json();
  console.log(result)
  
});

async function navigateToOptionsPage() {
  await chrome.runtime.openOptionsPage()
}

// a listener to each that removes an existing page and puts a new one
const navBarInputs: NodeListOf<HTMLInputElement> = document.querySelectorAll("#nav-bar input");
navBarInputs.forEach(input => handlePopupPageChange(input))