export default function () {
    // let the popup know if there is wifi
    if (navigator.onLine) {
        chrome.runtime.sendMessage({ name: "is_online", content: true });
    }
    else {
        chrome.runtime.sendMessage({ name: "is_online", content: false });
    }
}
