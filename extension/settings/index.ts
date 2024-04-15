// retrieve current API Key and language
(async () => {
  const {language, APIKey, enabledStreaming}: ILocalState = await chrome.storage.local.get(null);

  if (language) {
    const chosenOption = document.querySelector(`option[value=${language}]`);
    if (chosenOption) chosenOption.setAttribute("selected", "");
  }

  if (APIKey) {
    const APIKeyInput = document.querySelector("input[type='password']");
    enabledStreaming ? APIKeyInput?.setAttribute("disabled", "") : APIKeyInput?.removeAttribute("disabled")
    if (APIKeyInput instanceof HTMLInputElement) APIKeyInput.value = APIKey;
  }

  const enableStreamingInput: HTMLInputElement | null = document.querySelector("input[type='range']");
  if (enableStreamingInput) {
    const googleLanguageCodes = document.getElementById('google-language-codes');
    const openAILanguageCodes = document.getElementById('openai-language-codes');
    if (enabledStreaming) {
      enableStreamingInput.value = "1";
      googleLanguageCodes?.classList.remove('hide');
      openAILanguageCodes?.classList.add('hide');
    } else {
      enableStreamingInput.value = "0";
      googleLanguageCodes?.classList.add('hide');
      openAILanguageCodes?.classList.remove('hide');
    }
  }
})();

const form = document.querySelector("form");
form?.addEventListener("submit", saveSettings);

async function saveSettings(event: Event) {
  event.preventDefault();
  // show the spinner and remove button
  toggleLoadingIconAndButton();

  const formValues = retrieveFormValues()
  if (formValues) {
    await chrome.storage.local.set(formValues);
  }

  // show the submit button and remove spinner
  toggleLoadingIconAndButton();
  showSavedAnimation()
}

function retrieveFormValues(): ILocalState | undefined  {
  const languageSelect: HTMLSelectElement | null = document.querySelector("select");
  const APIKeyInput: HTMLInputElement | null = document.querySelector("input[type='password']");
  const enableStreamingInput: HTMLInputElement | null = document.querySelector("input[type='range']");

  if (languageSelect && APIKeyInput && enableStreamingInput) {
    return {
      language: languageSelect.value,
      APIKey: APIKeyInput.value,
      enabledStreaming: Boolean(Number(enableStreamingInput.value))
    }  
  }

}

function toggleLoadingIconAndButton() {
  const submitButton = document.querySelector("input[type='submit']");
  submitButton?.classList.toggle("hide");

  const spinner = document.getElementById("spinner");
  spinner?.classList.toggle("hide")
}

function showSavedAnimation() {
  const slider = document.getElementById("saved-slider");
  slider?.classList.toggle("hide");

  slider?.addEventListener("animationend", () => {
    slider.classList.toggle("hide");
  }, { once: true })
}

const enableStreamingInput: HTMLInputElement | null = document.querySelector("input[type='range']");
enableStreamingInput?.addEventListener("change", () => {
  const APIKeyInput = document.querySelector("input[name='APIKey']");
  const googleLanguageCodes = document.getElementById('google-language-codes');
  const openAILanguageCodes = document.getElementById('openai-language-codes');
  if (enableStreamingInput.value == "1" ) {
    APIKeyInput?.setAttribute("disabled", "");
    googleLanguageCodes?.classList.remove('hide');
    openAILanguageCodes?.classList.add('hide');
  } else {
    APIKeyInput?.removeAttribute("disabled");
    googleLanguageCodes?.classList.add('hide');
    openAILanguageCodes?.classList.remove('hide');
  }
})