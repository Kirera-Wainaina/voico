/**
 * Class with static methods to help toggle multiple elements at once
 */
var Toggle = /** @class */ (function () {
    function Toggle() {
    }
    /**
     * Toggle the display of an element
     * @param name name of the element it could be a tag name or id name
     * @param type type of the element to work with
     */
    Toggle.elementDisplay = function (name, type) {
        if (type === void 0) { type = "id"; }
        var element = type === "id"
            ? document.getElementById(name)
            : document.querySelector(name);
        element === null || element === void 0 ? void 0 : element.classList.toggle("hide");
    };
    ;
    Toggle.hint = function () {
        Toggle.elementDisplay("hint");
    };
    ;
    Toggle.loadingIcon = function () {
        Toggle.elementDisplay("input", "tag");
        Toggle.elementDisplay("hint");
        Toggle.elementDisplay("spinner");
    };
    Toggle.permissionNote = function () {
        Toggle.elementDisplay("permission-note");
    };
    Toggle.recordingAnimation = function () {
        Toggle.elementDisplay("recording-animation");
    };
    /**
     * Toggle the display of child elements
     * @param elementId element whose children you want to toggle
     */
    Toggle.children = function (elementId) {
        var element = document.getElementById(elementId);
        if (element instanceof HTMLElement) {
            var children = Array.from(element.children);
            if (children) {
                for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
                    var child = children_1[_i];
                    child.classList.toggle("hide");
                }
            }
        }
    };
    return Toggle;
}());
export default Toggle;
