import showNotification from "./showNotification.js";

export default async function() {
  const transcriptElement = document.getElementById("transcript");
  const transcriptContent = transcriptElement?.textContent;

  if (typeof transcriptContent == 'string') {
    await navigator.clipboard.writeText(transcriptContent)    
  }

  const copiedNotification = document.getElementById("copied-notification");
  if (copiedNotification) showNotification(copiedNotification)
}