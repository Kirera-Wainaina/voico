import adjustTranscriptNumber from "./adjustTranscriptNumber.js";

export default async function() {
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
  const previousIndex = (index - 1) < 0 ? transcriptsArray.length - 1 : index - 1;

  transcriptElement.textContent = transcriptsArray[previousIndex];

  adjustTranscriptNumber(previousIndex);
}