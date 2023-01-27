/**
 * Inspired by
 *    https://medium.com/geekculture/building-a-modular-synth-with-web-audio-api-and-javascript-d38ccdeca9ea
 *
 * @author  Ikaros Kappler
 * @date    2023-01-27
 * @version 1.0.0
 */

function renderNoteSelectTable(NOTE_INPUT_COUNT, setCurrentNotes, setCurrentNoteLengths, handleNoteSelectChange) {
  const noteSelectsTable = document.querySelector("#note-selects-table");
  const noteTableRow = document.createElement("tr");
  for (let i = 0; i < NOTE_INPUT_COUNT; i++) {
    const select = document.createElement("select");
    select.id = `note ${i + 1}`;
    select.setAttribute("data-index", i);
    select.classList.add("note-select");
    for (let j = 0; j < Object.keys(noteValues).length; j++) {
      const option = document.createElement("option");
      option.value = j;
      option.innerText = `${Object.keys(noteValues)[j]}`;
      select.appendChild(option);
      select.addEventListener("change", handleNoteSelectChange);
    }
    // Create duration slider
    // <input type="range" id="attack-control" value="0.3" min="0" max="0.5" step="0.02"><br></br>
    var lengthSlider = document.createElement("input");
    lengthSlider.setAttribute("type", "range");
    lengthSlider.setAttribute("min", 0.0);
    lengthSlider.setAttribute("max", 4.0);
    lengthSlider.setAttribute("orient", "vertical");
    lengthSlider.classList.add("note_duration_slider");
    lengthSlider.value = 1.0;
    lengthSlider.step = 0.1;
    lengthSlider.addEventListener("input", setCurrentNoteLengths);
    var sliderValueDisplay = document.createElement("span");
    sliderValueDisplay.innerHTML = 1.0;
    sliderValueDisplay.id = `note-length-display-${i + 1}`;
    sliderValueDisplay.classList.add("value-display");
    var noteCell = document.createElement("td");
    var noteCellDiv = document.createElement("div");
    noteCellDiv.classList.add("align-center");
    noteCellDiv.appendChild(sliderValueDisplay);
    noteCellDiv.appendChild(lengthSlider);
    noteCellDiv.appendChild(select);
    noteCell.appendChild(noteCellDiv);
    noteTableRow.appendChild(noteCell);
  }
  noteSelectsTable.appendChild(noteTableRow);
}
