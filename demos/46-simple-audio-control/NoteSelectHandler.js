/**
 * Inspired by
 *    https://medium.com/geekculture/building-a-modular-synth-with-web-audio-api-and-javascript-d38ccdeca9ea
 *
 * @author  Ikaros Kappler
 * @date    2023-01-27
 * @version 1.0.0
 */

(function (context) {
  const NOTE_INPUT_COUNT = 16;

  context.NoteSelectHandler = function (initialPreset) {
    this.currentNotes = convertPresetToNotes(NOTE_INPUT_COUNT, initialPreset.noteValues);

    var _self = this;
    function handleNoteSelectChange(event) {
      console.log("event", event, event.target.value);
      var noteIndex = event.target.value;
      var selectIndex = event.target.getAttribute("data-index");
      _self.currentNotes[selectIndex].noteIndex = noteIndex;
      var note = getNoteByIndex(noteIndex);
      _self.noteSelects[selectIndex].setAttribute("title", `${note.identifier} @${note.frequency}Hz`);
    }

    // function renderNoteSelectTable(NOTE_INPUT_COUNT, setCurrentNotes, setCurrentNoteLengths, handleNoteSelectChange) {
    const noteSelectsTable = document.querySelector("#note-selects-table");
    // Create the table row
    const noteTableRow = document.createElement("tr");
    // Now create n cells for n notes
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
      lengthSlider.addEventListener("input", function () {
        _self.setCurrentNoteLengths();
      });
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
    } // END for
    noteSelectsTable.appendChild(noteTableRow);

    // Create the rightest info cell
    var labelCell = document.createElement("td");
    labelCell.classList.add("align-top");
    var labelCellDiv = document.createElement("div");
    labelCellDiv.innerHTML = "dur ×";
    labelCell.classList.add("align-center", "vertical-text");
    labelCell.appendChild(labelCellDiv);
    noteTableRow.appendChild(labelCell);

    this._noteSelects = document.querySelectorAll("select");
    this._noteLengthSliders = document.querySelectorAll("input[type=range].note_duration_slider");
    console.log("noteLengthSliders", this._noteLengthSliders.length);

    this.setCurrentNoteLengthInputs();
    this.setNoteSelects();
  };

  context.NoteSelectHandler.NOTE_INPUT_COUNT = NOTE_INPUT_COUNT;

  context.NoteSelectHandler.prototype.setFromPreset = function (preset) {
    this.currentNotes = convertPresetToNotes(NoteSelectHandler.NOTE_INPUT_COUNT, preset.noteValues);
    console.log("Applying notes from preset");
    this.setCurrentNoteLengthInputs();
    this.setNoteSelects();
  };

  context.NoteSelectHandler.prototype.setNoteSelects = function () {
    for (let i = 0; i < this.currentNotes.length; i++) {
      var noteIndex = this.currentNotes[i].noteIndex;
      this._noteSelects[i].value = noteIndex;
      var noteIdentifier = Object.keys(noteValues)[noteIndex];
      var noteFrequency = noteValues[noteIdentifier];
      this._noteSelects[i].setAttribute("title", `${noteIdentifier} @${noteFrequency}Hz`);
    }
  };

  context.NoteSelectHandler.prototype.setCurrentNotes = function () {
    for (let i = 0; i < noteSelects.length; i++) {
      this.currentNotes[i].noteIndex = this._noteSelects[i].value;
    }
  };

  context.NoteSelectHandler.prototype.setCurrentNoteLengthInputs = function () {
    for (let i = 0; i < this._noteLengthSliders.length; i++) {
      this._noteLengthSliders[i].value = this.currentNotes[i].lengthFactor;
      document.getElementById(`note-length-display-${i + 1}`).innerHTML = this.currentNotes[i].lengthFactor;
    }
    console.log("currentNotes", this.currentNotes);
  };

  context.NoteSelectHandler.prototype.setCurrentNoteLengths = function () {
    for (let i = 0; i < this._noteLengthSliders.length; i++) {
      document.getElementById(`note-length-display-${i + 1}`).innerHTML = this._noteLengthSliders[i].value;
      this.currentNotes[i].lengthFactor = Number(this._noteLengthSliders[i].value);
    }
    console.log("currentNotes", currentNotes);
  };

  context.NoteSelectHandler.prototype.setPlayingNoteIndex = function (noteIndex) {
    this._noteSelects[noteIndex].classList.add("note-is-playing");
    if (this._noteSelects[noteIndex - 1]) {
      this._noteSelects[noteIndex - 1].classList.remove("note-is-playing");
    } else {
      this._noteSelects[NOTE_INPUT_COUNT - 1].classList.remove("note-is-playing");
    }
  };
})(globalThis);
