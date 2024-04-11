import Toggle from "./Toggle.js";
import changeRecordingState from "./changeRecordingState.js";
import getCurrentTabId from "./getCurrentTabId.js";
import showNotification from "./showNotification.js";

export default async function () {
  const tabId = await getCurrentTabId();
  if (!tabId) return // no tab id, no action
  
  const sessionState: ISessionState = await chrome.storage.session.get(null);
  const localState: ILocalState = await chrome.storage.local.get(["APIKey", "language", "enabledStreaming"]);

  if (localState.enabledStreaming) {
    // check if the user is signed in
    const { token } = await chrome.identity.getAuthToken({ interactive: false });
    if (!token) { // user isn't signed in
      // ask user to signin
      const errorElement = document.getElementById("not-signed-in-error");
      if (errorElement) showNotification(errorElement);
      return ;
    }
  }

  await chrome.tabs.sendMessage(
    tabId, 
    { name: "record_click", content: {...sessionState, ...localState} }
  );
  
  if (sessionState.permission_granted) {
    // only applicable if user has granted permission
    Toggle.recordingAnimation();
    await changeRecordingState()
  }
  handleLoadingIcon(sessionState.recording, localState.enabledStreaming);
}

function handleLoadingIcon(isRecording: boolean | undefined, isStreaming: boolean | undefined) {

  if (isRecording && !isStreaming) {
    // recording is on and button is pressed to switch it off
    // show loading icon because audio is being processed
    // not in streaming mode
    Toggle.loadingIcon()
  }
}