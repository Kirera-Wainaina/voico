import adjustTranscriptNumber from "./adjustTranscriptNumber.js";

export default async function () {
  let { transcripts } = await chrome.storage.local.get("transcripts");
  if (!transcripts) {
    return
  }
  const transcriptsArray: string[] = JSON.parse(transcripts);

  const transcriptElement = document.getElementById("transcript");
  const currentTranscript = transcriptElement?.textContent;

  if (!currentTranscript) return;

  const index = transcriptsArray
    .findIndex(transcript => transcript === currentTranscript);
  const nextIndex = (index + 1) >= transcriptsArray.length ? 0 : index + 1;

  transcriptElement.textContent = transcriptsArray[nextIndex];

  adjustTranscriptNumber(nextIndex);
}