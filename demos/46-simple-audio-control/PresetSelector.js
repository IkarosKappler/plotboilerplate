/**
 * @date 2023-01-28
 */

(function (context) {
  context.PresetSelector = function (onPresetSelected) {
    var presets = getPresetList();
    var keys = Object.keys(presets);

    var selectedIndex = 0;
    var selectedKey = keys[selectedIndex];
    var container = document.querySelector("#presets-container");

    var handlePresetSelectChange = function (event) {
      selectedKey = event.target.value;
      console.log("selectedKey", selectedKey);
      onPresetSelected(presets[selectedKey], false); // !isInitialSelect
    };

    const select = document.createElement("select");
    // select.id = `note ${i + 1}`;
    // select.setAttribute("data-index", i);
    // select.classList.add("note-select");
    select.value = selectedKey;
    for (let j = 0; j < keys.length; j++) {
      const option = document.createElement("option");
      option.value = keys[j];
      option.innerText = `${keys[j]}`;
      select.appendChild(option);
      select.addEventListener("change", handlePresetSelectChange);
    }

    container.appendChild(select);

    onPresetSelected(presets[selectedKey], true); // isInitialSelect
  };
})(globalThis);
