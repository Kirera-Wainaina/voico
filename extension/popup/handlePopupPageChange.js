var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import Toggle from "./Toggle.js";
import enterTranscriptIntoTranscriptElement from "./enterTranscriptIntoTranscriptElement.js";
import getGoogleUserDetails from "./getGoogleUserDetails.js";
export default function (navBarInput) {
    var _this = this;
    // skip the process for the settings icon
    if (navBarInput.id == "settings-icon")
        return;
    // set click event listener for each input
    navBarInput.addEventListener("click", function () { return __awaiter(_this, void 0, void 0, function () {
        var popupPages, page, page, imgElement, userData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    popupPages = document.querySelectorAll(".page");
                    popupPages.forEach(function (page) { return page.classList.add("hide"); });
                    // display the page associated with the input clicked
                    if (navBarInput.dataset.id) {
                        page = document.getElementById(navBarInput === null || navBarInput === void 0 ? void 0 : navBarInput.dataset.id);
                        page === null || page === void 0 ? void 0 : page.classList.remove("hide");
                    }
                    // enter transcript information if its transcript button
                    if (navBarInput.dataset.id == "transcript-page") {
                        enterTranscriptIntoTranscriptElement();
                    }
                    if (!(navBarInput.dataset.id == "account-page")) return [3 /*break*/, 2];
                    page = document.getElementById(navBarInput === null || navBarInput === void 0 ? void 0 : navBarInput.dataset.id);
                    imgElement = page === null || page === void 0 ? void 0 : page.querySelector("img");
                    return [4 /*yield*/, getGoogleUserDetails()];
                case 1:
                    userData = _a.sent();
                    if (userData.picture) { // user has signed in
                        if (imgElement)
                            imgElement.src = userData.picture;
                    }
                    else { // give user sign in button
                        Toggle.children("account-page");
                    }
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); });
}
