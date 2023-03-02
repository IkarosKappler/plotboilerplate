"use strict";
/**
 * @date 2023-01-28
 * @modified 2023-02-04 Ported to Typescript.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PresetSelector = void 0;
var presets_1 = require("./presets");
var PresetSelector = /** @class */ (function () {
    function PresetSelector(onPresetSelected) {
        var presets = presets_1.getPresetList();
        var keys = Object.keys(presets);
        var selectedIndex = 0;
        var selectedKey = keys[selectedIndex];
        var container = document.querySelector("#presets-container");
        var handlePresetSelectChange = function (event) {
            selectedKey = event.target.value;
            console.log("selectedKey", selectedKey);
            onPresetSelected(presets[selectedKey]); // !isInitialSelect
        };
        var select = document.createElement("select");
        // select.id = `note ${i + 1}`;
        // select.setAttribute("data-index", i);
        select.classList.add("preset-select");
        select.value = selectedKey;
        for (var j = 0; j < keys.length; j++) {
            var option = document.createElement("option");
            option.value = keys[j];
            option.innerText = "" + keys[j];
            select.appendChild(option);
            select.addEventListener("change", handlePresetSelectChange);
        }
        container.appendChild(select);
        // onPresetSelected(presets[selectedKey], true); // isInitialSelect
    }
    return PresetSelector;
}());
exports.PresetSelector = PresetSelector;
//# sourceMappingURL=PresetSelector.js.map