export default async function changeRecordingState() {
  const { recording }: ISessionState = await chrome.storage.session.get("recording");
  if (!recording) {
    chrome.storage.session.set({ 
      "recording": true,
      "user_media_is_setup": true
    } as ISessionState);
  } else {
    chrome.storage.session.set({ "recording": false } as ISessionState);
  }
}