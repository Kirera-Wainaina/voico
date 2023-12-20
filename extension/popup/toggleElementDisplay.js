export default function (name, type) {
    if (type === void 0) { type = "id"; }
    var element = type === "id"
        ? document.getElementById(name)
        : document.querySelector(name);
    element === null || element === void 0 ? void 0 : element.classList.toggle("hide");
}
