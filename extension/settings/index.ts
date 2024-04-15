// retrieve current API Key and language
(async () => {
  const {streamingLanguage, recordingLanguage, APIKey, enabledStreaming}: ILocalState = await chrome.storage.local.get(null);

  if (streamingLanguage) {
    const chosenOption = document.querySelector(`select[id='streaming-language-codes'] option[value=${streamingLanguage}]`);
    if (chosenOption) chosenOption.setAttribute("selected", "");
  }

  if (recordingLanguage) {
    const chosenOption = document.querySelector(`select[id='recording-language-codes'] option[value=${recordingLanguage}]`);
    if (chosenOption) chosenOption.setAttribute("selected", "");
  }

  if (APIKey) {
    const APIKeyInput = document.querySelector("input[type='password']");
    enabledStreaming ? APIKeyInput?.setAttribute("disabled", "") : APIKeyInput?.removeAttribute("disabled")
    if (APIKeyInput instanceof HTMLInputElement) APIKeyInput.value = APIKey;
  }

  const enableStreamingInput: HTMLInputElement | null = document.querySelector("input[type='range']");
  if (enableStreamingInput) {
    const streamingLanguageCodes = document.getElementById('streaming-language-codes');
    const recordingLanguageCodes = document.getElementById('recording-language-codes');
    if (enabledStreaming) {
      enableStreamingInput.value = "1";
      streamingLanguageCodes?.classList.remove('hide');
      recordingLanguageCodes?.classList.add('hide');
    } else {
      enableStreamingInput.value = "0";
      streamingLanguageCodes?.classList.add('hide');
      recordingLanguageCodes?.classList.remove('hide');
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
  const recordingLanguageSelect: HTMLSelectElement | null = document.querySelector("select[id='recording-language-codes']");
  const streamingLanguageSelect: HTMLSelectElement | null = document.querySelector("select[id='streaming-language-codes']");
  const APIKeyInput: HTMLInputElement | null = document.querySelector("input[type='password']");
  const enableStreamingInput: HTMLInputElement | null = document.querySelector("input[type='range']");

  if (recordingLanguageSelect && streamingLanguageSelect && APIKeyInput && enableStreamingInput) {
    return {
      recordingLanguage: recordingLanguageSelect.value,
      streamingLanguage: streamingLanguageSelect.value,
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
  const streamingLanguageCodes = document.getElementById('streaming-language-codes');
  const recordingLanguageCodes = document.getElementById('recording-language-codes');
  if (enableStreamingInput.value == "1" ) {
    APIKeyInput?.setAttribute("disabled", "");
    streamingLanguageCodes?.classList.remove('hide');
    recordingLanguageCodes?.classList.add('hide');
  } else {
    APIKeyInput?.removeAttribute("disabled");
    streamingLanguageCodes?.classList.add('hide');
    recordingLanguageCodes?.classList.remove('hide');
  }
})