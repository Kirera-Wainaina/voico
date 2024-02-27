import Toggle from "./Toggle.js";
import enterTranscriptIntoTranscriptElement from "./enterTranscriptIntoTranscriptElement.js";
import getGoogleUserDetails from "./getGoogleUserDetails.js";

export default function (navBarInput:HTMLInputElement) {
  // skip the process for the settings icon
  if (navBarInput.id == "settings-icon") return ;

  // set click event listener for each input
  navBarInput.addEventListener("click", async () => {
    // hide all pages before setting the visible
    const popupPages: NodeListOf<HTMLDivElement> = document.querySelectorAll(".page");
    popupPages.forEach(page => page.classList.add("hide"));
  
    // display the page associated with the input clicked
    if (navBarInput.dataset.id) {
      const page = document.getElementById(navBarInput?.dataset.id);
      page?.classList.remove("hide");  
    }

    // enter transcript information if its transcript button
    if (navBarInput.dataset.id == "transcript-page") {
      enterTranscriptIntoTranscriptElement()
    }

    // display sign in button or streaming advice
    if (navBarInput.dataset.id == "account-page") {
      await populateAccountPage(navBarInput.dataset.id)
    }
  })
}

async function populateAccountPage(pageId: string) {
  const page = document.getElementById(pageId);
  const imgElement = page?.querySelector("img");
  const greetingElement = page?.querySelector("#greeting");
  const userData = await getGoogleUserDetails();
  console.log(userData)

  if (userData.picture) { // user has signed in
    if (imgElement) imgElement.src = userData.picture;
    if (greetingElement) greetingElement.textContent = `Hello ${userData.given_name}`;
  } else { // give user sign in button
    Toggle.children("account-page");
  }  
}