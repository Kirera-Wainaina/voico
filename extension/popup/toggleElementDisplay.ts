export default function (name: string, type: "id" | "tag" = "id") {
  const element = type === "id" 
    ? document.getElementById(name)
    : document.querySelector(name);
  element?.classList.toggle("hide");
}