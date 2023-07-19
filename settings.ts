type Settings = {
  language: string,
  APIKey: string
}

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
  toggleLoadingIconAndButton()
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