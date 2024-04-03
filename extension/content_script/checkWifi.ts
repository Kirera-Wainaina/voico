chrome.runtime.onMessage.addListener(handleMessagesOnCheckWifi);

async function handleMessagesOnCheckWifi(message: ChromeMessage) {
  
  if (message.name == "wifi_check") {
    checkWifi();
  }
}

function checkWifi() {
  // let the popup know if there is wifi
  if (navigator.onLine) {
    chrome.runtime.sendMessage({ name: "is_online", content: true });
  } else {
    chrome.runtime.sendMessage({ name: "is_online", content: false });
  }
}