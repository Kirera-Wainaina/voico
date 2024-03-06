// retrieve current API Key and language
(async () => {
  const {language, APIKey} = await chrome.storage.local.get(null);

  if (language) {
    const chosenOption = document.querySelector(`option[value=${language}]`);
    if (chosenOption) chosenOption.setAttribute("selected", "");
  }

  if (APIKey) {
    const APIKeyInput = document.querySelector("input[type='password']");
    if (APIKeyInput instanceof HTMLInputElement) APIKeyInput.value = APIKey;
  }
})();

// const freeVersionToggleButton = document.querySelector("#version-toggle button:first-child");
// const premiumVersionToggleButton = document.querySelector("#version-toggle button:last-child");

// freeVersionToggleButton?.addEventListener('click', toggleSettings);
// premiumVersionToggleButton?.addEventListener('click', toggleSettings);

// function toggleSettings() {
//   freeVersionToggleButton?.classList.toggle('activate-version');
//   premiumVersionToggleButton?.classList.toggle('activate-version');

//   const freeVersionSettingsContainer = document.querySelector('#free-version-settings');
//   const premiumVersionSettingsContainer = document.querySelector('#premium-version-settings');

//   freeVersionSettingsContainer?.classList.toggle('hide');
//   premiumVersionSettingsContainer?.classList.toggle('hide');
// }

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
  enableStreamingInput.value == "1" 
    ? APIKeyInput?.setAttribute("disabled", "") 
    : APIKeyInput?.removeAttribute("disabled")
})