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
        const formValues = retrieveFormValues();
        if (formValues) {
            yield chrome.storage.local.set(formValues);
        }
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
