import enterTranscriptIntoTranscriptElement from "./enterTranscriptIntoTranscriptElement.js";
export default function (navBarInput) {
    // skip the process for the settings icon
    if (navBarInput.id == "settings-icon")
        return;
    // set click event listener for each input
    navBarInput.addEventListener("click", function () {
        // hide all pages before setting the visible
        var popupPages = document.querySelectorAll(".page");
        popupPages.forEach(function (page) { return page.classList.add("hide"); });
        // display the page associated with the input clicked
        if (navBarInput.dataset.id) {
            var page = document.getElementById(navBarInput === null || navBarInput === void 0 ? void 0 : navBarInput.dataset.id);
            page === null || page === void 0 ? void 0 : page.classList.remove("hide");
        }
        // enter transcript information if its transcript button
        if (navBarInput.dataset.id == "transcript-page") {
            enterTranscriptIntoTranscriptElement();
        }
    });
}
