import Toggle from "./Toggle.js";
import changeRecordingState from "./changeRecordingState.js";
import getCurrentTabId from "./getCurrentTabId.js";

export default async function () {
  const tabId = await getCurrentTabId();
  if (!tabId) return // no tab id, no action
  
  const sessionState: ISessionState = await chrome.storage.session.get(null);
  // get API KEY and language
  const localState = await chrome.storage.local.get(["APIKey", "language"]);
  await chrome.tabs.sendMessage(
    tabId, 
    { name: "record_click", content: {...sessionState, ...localState} }
  );
  
  if (sessionState.permission_granted) {
    // only applicable if user has granted permission
    Toggle.recordingAnimation();
    Toggle.hint();  
    await changeRecordingState()
  }
  handleLoadingIcon(sessionState.recording);
}

function handleLoadingIcon(recordingState: boolean | undefined) {
  if (recordingState) {
    // recording is on, button is pressed to switch it off
    // show loading icon because audio is being processed
    Toggle.loadingIcon()
  }
}