export default function () {
    return chrome.tabs.query({ active: true, currentWindow: true })
        .then(function (tabs) { return tabs[0].id; });
}
