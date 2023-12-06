type Settings = {
  language: string,
  APIKey: string
}

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
})()

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

function retrieveFormValues():Settings | undefined  {
  const languageSelect = form?.querySelector("select");
  let APIKeyInput = form?.querySelector("input[type='password']");

  if (
    languageSelect instanceof HTMLSelectElement 
    && APIKeyInput instanceof HTMLInputElement
  ) {
    return {
      language: languageSelect.value,
      APIKey: APIKeyInput.value
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
  })
}