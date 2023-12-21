export default function(newIndex: number) {
  // let the user know which transcript they are looking at out of 5
  const transcriptNumberElement = document.getElementById("transcript-number");
  let transcriptNumber = newIndex + 1;

  if (transcriptNumberElement) {
    transcriptNumberElement.textContent = `${transcriptNumber} / 5`;
  }

}