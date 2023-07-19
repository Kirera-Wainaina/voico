type Settings = {
  language: string,
  APIKey: string
}

const form = document.querySelector("form");
form?.addEventListener("submit", saveSettings);

async function saveSettings(event: Event) {
  event.preventDefault();

  const formValues = retrieveFormValues()
  if (formValues) {
    await chrome.storage.local.set(formValues);
  }
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