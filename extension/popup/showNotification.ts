
export default function (element: HTMLElement) {
  element?.classList.toggle("hide");
  element?.classList.toggle("notify");

  // hide the notification again
  element?.addEventListener("animationend", () => {
    element?.classList.toggle("hide");
    element?.classList.toggle("notify");
  })
}