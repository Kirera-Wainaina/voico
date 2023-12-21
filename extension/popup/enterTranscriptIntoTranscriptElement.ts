export default async function enterTranscriptIntoTranscriptElement() {
  let { transcripts } = await chrome.storage.local.get("transcripts");
  const transcriptElement = document.getElementById("transcript");

  if (transcripts && transcriptElement) {
    transcripts = JSON.parse(transcripts);
    transcriptElement.textContent = transcripts[0];
  } else if (!transcripts && transcriptElement) {
    transcriptElement.textContent = "no transcripts yet!"
  }  
}