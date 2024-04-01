chrome.runtime.onMessage.addListener(handleMessagesOnStreaming);
function handleMessagesOnStreaming(message) {
    // don't run anything if streaming is off
    if (!message.content.enabledStreaming)
        return;
}
