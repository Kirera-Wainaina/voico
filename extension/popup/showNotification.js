export default function (element) {
    element === null || element === void 0 ? void 0 : element.classList.toggle("hide");
    element === null || element === void 0 ? void 0 : element.classList.toggle("notify");
    // hide the notification again
    element === null || element === void 0 ? void 0 : element.addEventListener("animationend", function () {
        element === null || element === void 0 ? void 0 : element.classList.toggle("hide");
        element === null || element === void 0 ? void 0 : element.classList.toggle("notify");
    }, { once: true });
}
