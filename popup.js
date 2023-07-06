var input = document.querySelector("input");
input === null || input === void 0 ? void 0 : input.addEventListener("click", toggleHintAndAnimation);
function toggleHintAndAnimation() {
    var hint = document.querySelector("p");
    hint === null || hint === void 0 ? void 0 : hint.classList.toggle("hide");
    var recordingAnimation = document.getElementById("recording-animation");
    recordingAnimation === null || recordingAnimation === void 0 ? void 0 : recordingAnimation.classList.toggle("hide");
}
