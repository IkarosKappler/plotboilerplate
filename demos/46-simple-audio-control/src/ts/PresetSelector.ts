/**
 * @date 2023-01-28
 * @modified 2023-02-04 Ported to Typescript.
 */

import { TrackPreset } from "./interfaces";
import { getPresetList } from "./presets";

export class PresetSelector {
  constructor(onPresetSelected: (selectedPreset: TrackPreset) => void) {
    const presets = getPresetList();
    const keys = Object.keys(presets);

    var selectedIndex = 0;
    var selectedKey = keys[selectedIndex];
    const container: HTMLDivElement = document.querySelector("#presets-container") as HTMLDivElement;

    const handlePresetSelectChange = (event: Event) => {
      selectedKey = (event.target as HTMLInputElement).value;
      console.log("selectedKey", selectedKey);
      onPresetSelected(presets[selectedKey]); // !isInitialSelect
    };

    const select = document.createElement("select");
    // select.id = `note ${i + 1}`;
    // select.setAttribute("data-index", i);
    // select.classList.add("note-select");
    select.value = selectedKey;
    for (let j = 0; j < keys.length; j++) {
      const option: HTMLOptionElement = document.createElement("option");
      option.value = keys[j];
      option.innerText = `${keys[j]}`;
      select.appendChild(option);
      select.addEventListener("change", handlePresetSelectChange);
    }

    container.appendChild(select);

    // onPresetSelected(presets[selectedKey], true); // isInitialSelect
  }
}
