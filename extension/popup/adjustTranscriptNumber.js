export default function (newIndex) {
    // let the user know which transcript they are looking at out of 5
    var transcriptNumberElement = document.getElementById("transcript-number");
    var transcriptNumber = newIndex + 1;
    if (transcriptNumberElement) {
        transcriptNumberElement.textContent = "".concat(transcriptNumber, " / 5");
    }
}
