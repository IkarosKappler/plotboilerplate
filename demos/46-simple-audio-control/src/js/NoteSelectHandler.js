"use strict";
/**
 * Inspired by
 *    https://medium.com/geekculture/building-a-modular-synth-with-web-audio-api-and-javascript-d38ccdeca9ea
 *
 * @author  Ikaros Kappler
 * @date    2023-01-27
 * @modified 2023-02-04 Ported to Typescript.
 * @version 1.0.1
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteSelectHandler = void 0;
var noteValues_1 = require("./noteValues");
var presets_1 = require("./presets");
var NOTE_INPUT_COUNT = 16;
var NoteSelectHandler = /** @class */ (function () {
    function NoteSelectHandler(initialPreset) {
        // Array<
        this.currentNotes = presets_1.convertPresetToNotes(NOTE_INPUT_COUNT, initialPreset.noteValues);
        var _self = this;
        function handleNoteSelectChange(event) {
            console.log("event", event, event.target.value);
            var noteIndex = event.target.value;
            var selectIndex = event.target.getAttribute("data-index");
            _self.currentNotes[selectIndex].noteIndex = noteIndex;
            var note = noteValues_1.getNoteByIndex(noteIndex);
            _self._noteSelects[selectIndex].setAttribute("title", note.identifier + " @" + note.frequency + "Hz");
        }
        function handleNoteDurationChange() {
            _self.setCurrentNoteLengths();
        }
        var noteSelectsTable = document.querySelector("#note-selects-table");
        var trackCount = 1;
        for (var rowIndex = 0; rowIndex < trackCount; rowIndex++) {
            createNoteSelectRow(noteSelectsTable, handleNoteSelectChange, handleNoteDurationChange);
        }
        this._noteSelects = document.querySelectorAll("select");
        this._noteLengthSliders = document.querySelectorAll("input[type=range].note_duration_slider");
        console.log("noteLengthSliders", this._noteLengthSliders.length);
        this.setCurrentNoteLengthInputs();
        this.setNoteSelects();
        //   NOTE_INPUT_COUNT = NOTE_INPUT_COUNT
    }
    // context.NoteSelectHandler.NOTE_INPUT_COUNT = NOTE_INPUT_COUNT;
    NoteSelectHandler.prototype.setFromPreset = function (preset) {
        this.currentNotes = presets_1.convertPresetToNotes(NoteSelectHandler.NOTE_INPUT_COUNT, preset.noteValues);
        console.log("Applying notes from preset");
        this.setCurrentNoteLengthInputs();
        this.setNoteSelects();
    };
    NoteSelectHandler.prototype.setNoteSelects = function () {
        for (var i = 0; i < this.currentNotes.length; i++) {
            var noteIndex = this.currentNotes[i].noteIndex;
            this._noteSelects[i].value = "" + noteIndex;
            var noteIdentifier = Object.keys(noteValues_1.noteValues)[noteIndex];
            var noteFrequency = noteValues_1.noteValues[noteIdentifier];
            this._noteSelects[i].setAttribute("title", noteIdentifier + " @" + noteFrequency + "Hz");
        }
    };
    NoteSelectHandler.prototype.setCurrentNotes = function () {
        for (var i = 0; i < this._noteSelects.length; i++) {
            this.currentNotes[i].noteIndex = Number(this._noteSelects[i].value);
        }
    };
    NoteSelectHandler.prototype.setCurrentNoteLengthInputs = function () {
        for (var i = 0; i < this._noteLengthSliders.length; i++) {
            // this._noteLengthSliders[i].value = this.currentNotes[i].lengthFactor;
            // CHANGED both
            this._noteLengthSliders[i].setAttribute("value", "" + this.currentNotes[i].lengthFactor);
            document.getElementById("note-length-display-" + (i + 1)).innerHTML = String(this.currentNotes[i].lengthFactor);
        }
        console.log("currentNotes", this.currentNotes);
    };
    NoteSelectHandler.prototype.setCurrentNoteLengths = function () {
        for (var i = 0; i < this._noteLengthSliders.length; i++) {
            document.getElementById("note-length-display-" + (i + 1)).innerHTML = this._noteLengthSliders[i].value;
            this.currentNotes[i].lengthFactor = Number(this._noteLengthSliders[i].value);
        }
        console.log("currentNotes", this.currentNotes);
    };
    NoteSelectHandler.prototype.setPlayingNoteIndex = function (noteIndex) {
        this._noteSelects[noteIndex].classList.add("note-is-playing");
        if (this._noteSelects[noteIndex - 1]) {
            this._noteSelects[noteIndex - 1].classList.remove("note-is-playing");
        }
        else {
            this._noteSelects[NOTE_INPUT_COUNT - 1].classList.remove("note-is-playing");
        }
    };
    return NoteSelectHandler;
}());
exports.NoteSelectHandler = NoteSelectHandler;
/**
 * Create a new row of note inputs in the note select table.
 *
 * @param {HTMLTableElement} noteSelectsTable - The table element from the DOM.
 * @param {function} handleNoteSelectChange - A callback to handle note value changes.
 */
var createNoteSelectRow = function (noteSelectsTable, handleNoteSelectChange, handleNoteDurationChange) {
    // Create the table row
    var noteTableRow = document.createElement("tr");
    // Now create n cells for n notes
    for (var i = 0; i < NOTE_INPUT_COUNT; i++) {
        var select = document.createElement("select");
        select.id = "note " + (i + 1);
        select.setAttribute("data-index", "" + i);
        select.classList.add("note-select");
        for (var j = 0; j < Object.keys(noteValues_1.noteValues).length; j++) {
            var option = document.createElement("option");
            option.value = "" + j;
            option.innerText = "" + Object.keys(noteValues_1.noteValues)[j];
            select.appendChild(option);
            select.addEventListener("change", handleNoteSelectChange);
        }
        // Create duration slider
        // <input type="range" id="attack-control" value="0.3" min="0" max="0.5" step="0.02"><br></br>
        var lengthSlider = document.createElement("input");
        lengthSlider.setAttribute("type", "range");
        lengthSlider.setAttribute("min", "0.0");
        lengthSlider.setAttribute("max", "4.0");
        lengthSlider.setAttribute("orient", "vertical");
        lengthSlider.classList.add("note_duration_slider");
        lengthSlider.value = "1.0";
        lengthSlider.step = "0.1";
        // lengthSlider.addEventListener("input", function () {
        //   _self.setCurrentNoteLengths();
        // });
        lengthSlider.addEventListener("input", function () {
            handleNoteDurationChange();
        });
        var sliderValueDisplay = document.createElement("span");
        sliderValueDisplay.innerHTML = "1.0";
        sliderValueDisplay.id = "note-length-display-" + (i + 1);
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
};
NoteSelectHandler.NOTE_INPUT_COUNT = NOTE_INPUT_COUNT;
//# sourceMappingURL=NoteSelectHandler.js.map