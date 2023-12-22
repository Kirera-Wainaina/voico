/*
 * this is where audio is recorded and transmitted to the server
*/
import handleContentScriptMessages from "./handleContentScriptMessages.js";
chrome.runtime.onMessage.addListener(handleContentScriptMessages);
