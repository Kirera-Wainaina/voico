import enterTranscriptIntoTranscriptElement from "./enterTranscriptIntoTranscriptElement.js";

export default function (navBarInput:HTMLInputElement) {
  // skip the process for the settings icon
  if (navBarInput.id == "settings-icon") return ;

  // set click event listener for each input
  navBarInput.addEventListener("click", () => {
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
  })
}