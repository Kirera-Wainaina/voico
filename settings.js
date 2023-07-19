var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const form = document.querySelector("form");
form === null || form === void 0 ? void 0 : form.addEventListener("submit", saveSettings);
function saveSettings(event) {
    return __awaiter(this, void 0, void 0, function* () {
        event.preventDefault();
        // show the spinner and remove button
        toggleLoadingIconAndButton();
        const formValues = retrieveFormValues();
        if (formValues) {
            yield chrome.storage.local.set(formValues);
        }
        // show the submit button and remove spinner
        toggleLoadingIconAndButton();
        showSavedAnimation();
    });
}
function retrieveFormValues() {
    const languageSelect = form === null || form === void 0 ? void 0 : form.querySelector("select");
    let APIKeyInput = form === null || form === void 0 ? void 0 : form.querySelector("input[type='password']");
    if (languageSelect instanceof HTMLSelectElement
        && APIKeyInput instanceof HTMLInputElement) {
        return {
            language: languageSelect.value,
            APIKey: APIKeyInput.value
        };
    }
}
function toggleLoadingIconAndButton() {
    const submitButton = document.querySelector("input[type='submit']");
    submitButton === null || submitButton === void 0 ? void 0 : submitButton.classList.toggle("hide");
    const spinner = document.getElementById("spinner");
    spinner === null || spinner === void 0 ? void 0 : spinner.classList.toggle("hide");
}
function showSavedAnimation() {
    const slider = document.getElementById("saved-slider");
    slider === null || slider === void 0 ? void 0 : slider.classList.toggle("hide");
    slider === null || slider === void 0 ? void 0 : slider.addEventListener("animationend", () => {
        slider.classList.toggle("hide");
    });
}
