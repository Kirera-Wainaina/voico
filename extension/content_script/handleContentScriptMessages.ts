import checkForWifi from "./checkForWifi.js";
import handleRecording from "./handleRecording.js";

export default async function(message: ChromeMessage) {
  
  switch (message.name) {
    case "record_click":
      await handleRecording(message.content);
      break;

    case "wifi_check":
      checkForWifi();
      break;
  
    default:
      break;
  }
}