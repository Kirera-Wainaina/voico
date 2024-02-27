/**
 * Class with static methods to help toggle multiple elements at once
 */
export default class Toggle {
  /**
   * Toggle the display of an element
   * @param name name of the element it could be a tag name or id name
   * @param type type of the element to work with
   */
  static elementDisplay (name: string, type: "id" | "tag" = "id") {
    const element = type === "id" 
      ? document.getElementById(name)
      : document.querySelector(name);
    element?.classList.toggle("hide");
  };

  static hint () {
    Toggle.elementDisplay("hint")
  };

  static loadingIcon() {
    Toggle.elementDisplay("input", "tag");
    Toggle.elementDisplay("hint");
    Toggle.elementDisplay("spinner");
  }

  static permissionNote() {
    Toggle.elementDisplay("permission-note");
  }

  static recordingAnimation() {
    Toggle.elementDisplay("recording-animation");
  }

  /**
   * Toggle the display of child elements
   * @param elementId element whose children you want to toggle
   */
  static children(elementId: string) {
    const element: HTMLElement | null = document.getElementById(elementId);

    if (element instanceof HTMLElement) {
      const children = Array.from(element.children);
      if (children) {
        for (const child of children) {
          child.classList.toggle("hide")
        }
      }
    }
  }
}