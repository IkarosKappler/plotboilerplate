"use strict";
/**
 * Inspired by
 *    https://medium.com/geekculture/building-a-modular-synth-with-web-audio-api-and-javascript-d38ccdeca9ea
 *
 * @author   Ikaros Kappler
 * @date     2023-01-27
 * @modified 2023-02-04 Ported to Typescript.
 * @version  1.0.1
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteSelectHandler = void 0;
var cloneObject_1 = require("./cloneObject");
var noteValues_1 = require("./noteValues");
var presets_1 = require("./presets");
var NOTE_INPUT_COUNT = 16;
var NoteSelectHandler = /** @class */ (function () {
    function NoteSelectHandler(initialPreset, trackCount, onTrackSelected) {
        this.trackCount = trackCount || 1;
        this.selectedTrackIndex = 0;
        this._onTrackSelected = onTrackSelected;
        if (typeof trackCount === "undefined") {
            console.info("[NoteSelectHandler] `trackCount` not provided, using default setting 1.");
        }
        this._createNoteSelectsDOM(initialPreset);
    }
    NoteSelectHandler.prototype._createNoteSelectsDOM = function (preset) {
        var _this = this;
        this.setCurrentNotesFromPreset(preset);
        var _self = this;
        var handleNoteSelectChange = function (event) {
            console.log("event", event, event.target.value);
            var noteIndex = event.target.value;
            var affectedTrackIndex = event.target.getAttribute("data-trackIndex");
            console.log("affectedTrackIndex", affectedTrackIndex);
            var selectIndex = event.target.getAttribute("data-index");
            for (var trackIndex = 0; trackIndex < _self.trackCount; trackIndex++) {
                // _self.currentNotes[selectTrackIndex][selectIndex].noteIndex = noteIndex;
                _self.tracks[affectedTrackIndex].currentNotes[selectIndex].noteIndex = noteIndex;
            }
            var note = noteValues_1.getNoteByIndex(noteIndex);
            _self._noteSelects[affectedTrackIndex][selectIndex].setAttribute("title", note.identifier + " @" + note.frequency + "Hz");
            _self.setCurrentNoteFreuqencyDisplays();
        };
        function handleNoteDurationChange() {
            _self.setCurrentNoteLengths();
        }
        var handleTrackMutedChange = function (trackIndex, isChecked) {
            console.log("is muted", isChecked);
            _this.isTrackMuted[trackIndex] = isChecked;
        };
        var handleTrackSelectedChange = function (trackIndex, checked) {
            var _a, _b;
            for (var t = 0; t < _this.trackCount; t++) {
                if (t != trackIndex) {
                    (_a = document.querySelector(".noteTableRow-" + t)) === null || _a === void 0 ? void 0 : _a.classList.remove("selected-track");
                }
            }
            (_b = document.querySelector(".noteTableRow-" + trackIndex)) === null || _b === void 0 ? void 0 : _b.classList.add("selected-track");
            _this.selectedTrackIndex = trackIndex;
            _self._onTrackSelected(_self.tracks[_self.selectedTrackIndex], _self.selectedTrackIndex);
        };
        var noteSelectsTable = document.querySelector("#note-selects-table");
        emptyElement(noteSelectsTable);
        this._noteSelects = [];
        this.isTrackMuted = [];
        for (var trackIndex = 0; trackIndex < this.trackCount; trackIndex++) {
            createNoteSelectRow(noteSelectsTable, trackIndex, handleNoteSelectChange, handleNoteDurationChange, handleTrackMutedChange, handleTrackSelectedChange);
            this._noteSelects[trackIndex] = document.querySelectorAll("select[data-trackindex='" + trackIndex + "'].note-select");
            this.isTrackMuted.push(false);
        }
        this._noteLengthSliders = [];
        for (var trackIndex = 0; trackIndex < this.trackCount; trackIndex++) {
            this._noteLengthSliders.push(document.querySelectorAll("input[type=range].note_duration_slider_" + trackIndex));
        }
        console.log("noteLengthSliders", this._noteLengthSliders.length);
        this.setCurrentNoteLengthInputs();
        this.setNoteSelects();
        this.setCurrentNoteFreuqencyDisplays();
    };
    NoteSelectHandler.prototype.setTrackCount = function (preset, newTrackCount) {
        this.trackCount = newTrackCount;
        this._createNoteSelectsDOM(preset);
        this.setCurrentNotesFromPreset(preset);
    };
    NoteSelectHandler.prototype.setCurrentNotesFromPreset = function (preset) {
        this.tracks = [];
        for (var trackIndex = 0; trackIndex < this.trackCount; trackIndex++) {
            // Important: create clones here (we don't want to change the preset if
            //   the track settings get changed)
            var track = {
                currentNotes: [],
                envelope: cloneObject_1.cloneObject(preset.envelope),
                mainValues: cloneObject_1.cloneObject(preset.mainValues),
                oscillator: cloneObject_1.cloneObject(preset.oscillator),
                vibratoValues: cloneObject_1.cloneObject(preset.vibratoValues)
                // delayValues: cloneObject(preset.delayValues)
            };
            // track.envelope = { preset.envelope};
            this.tracks.push(track);
            track.currentNotes = presets_1.convertPresetToNotes(NOTE_INPUT_COUNT, preset.noteValues);
            if (trackIndex === 1) {
                // For testing: transpose the first track one octave down
                for (var i = 0; i < track.currentNotes.length; i++) {
                    track.currentNotes[i].noteIndex -= 12;
                }
            }
        }
    };
    NoteSelectHandler.prototype.setFromPreset = function (preset) {
        this.setCurrentNotesFromPreset(preset);
        console.log("Applying notes from preset");
        this.setCurrentNoteLengthInputs();
        this.setNoteSelects();
        this.setCurrentNoteFreuqencyDisplays();
    };
    NoteSelectHandler.prototype.setNoteSelects = function () {
        for (var trackIndex = 0; trackIndex < this.trackCount; trackIndex++) {
            // for (let i = 0; i < this.currentNotes[trackIndex].length; i++) {
            for (var i = 0; i < this.tracks[trackIndex].currentNotes.length; i++) {
                // const noteIndex = this.currentNotes[trackIndex][i].noteIndex;
                var noteIndex = this.tracks[trackIndex].currentNotes[i].noteIndex;
                // console.log("i noteIndex", i, noteIndex);
                this._noteSelects[trackIndex][i].value = "" + noteIndex;
                var noteIdentifier = Object.keys(noteValues_1.noteValues)[noteIndex];
                var noteFrequency = noteValues_1.noteValues[noteIdentifier];
                this._noteSelects[trackIndex][i].setAttribute("title", noteIdentifier + " @" + noteFrequency + "Hz");
            }
        }
    };
    NoteSelectHandler.prototype.setCurrentNotes = function () {
        for (var trackIndex = 0; trackIndex < this.trackCount; trackIndex++) {
            for (var i = 0; i < this._noteSelects.length; i++) {
                // this.currentNotes[trackIndex][i].noteIndex = Number(this._noteSelects[trackIndex][i].value);
                this.tracks[trackIndex].currentNotes[i].noteIndex = Number(this._noteSelects[trackIndex][i].value);
            }
        }
    };
    NoteSelectHandler.prototype.setCurrentNoteLengthInputs = function () {
        for (var trackIndex = 0; trackIndex < this.trackCount; trackIndex++) {
            for (var i = 0; i < this._noteLengthSliders[trackIndex].length; i++) {
                // this._noteLengthSliders[trackIndex][i].value = String(this.currentNotes[trackIndex][i].lengthFactor);
                this._noteLengthSliders[trackIndex][i].value = String(this.tracks[trackIndex].currentNotes[i].lengthFactor);
                this.setNoteLengthDisplay(trackIndex, i);
                // const noteIndex = this.tracks[trackIndex].currentNotes[i].noteIndex;
                // const note = getNoteByIndex(noteIndex);
                // const noteFrequencyDisplay = document.querySelector(`#note-frequency-display-${trackIndex}-${i}`) as HTMLDivElement;
                // noteFrequencyDisplay.innerHTML = `${note.frequency}`;
            }
        }
        console.log("this.tracks", this.tracks);
    };
    NoteSelectHandler.prototype.setCurrentNoteFreuqencyDisplays = function () {
        console.log("setCurrentNoteFreuqencyDisplays");
        for (var trackIndex = 0; trackIndex < this.trackCount; trackIndex++) {
            for (var i = 0; i < this._noteLengthSliders[trackIndex].length; i++) {
                var noteIndex = this.tracks[trackIndex].currentNotes[i].noteIndex;
                var note = noteValues_1.getNoteByIndex(noteIndex);
                var noteFrequencyDisplay = document.querySelector("#note-frequency-display-" + trackIndex + "-" + i);
                if (typeof noteIndex === "undefined" || noteIndex < 0 || !note) {
                    noteFrequencyDisplay.innerHTML = "&nbsp;";
                }
                else {
                    noteFrequencyDisplay.innerHTML = "" + note.frequency;
                }
            }
        }
    };
    NoteSelectHandler.prototype.setCurrentNoteLengths = function () {
        for (var trackIndex = 0; trackIndex < this.trackCount; trackIndex++) {
            for (var i = 0; i < this._noteLengthSliders[trackIndex].length; i++) {
                this.setNoteLengthDisplay(trackIndex, i);
                this.tracks[trackIndex].currentNotes[i].lengthFactor = Number(this._noteLengthSliders[trackIndex][i].value);
            }
        }
        console.log("this.tracks", this.tracks);
    };
    NoteSelectHandler.prototype.setPlayingNoteIndex = function (noteIndex) {
        for (var trackIndex = 0; trackIndex < this.trackCount; trackIndex++) {
            this._noteSelects[trackIndex][noteIndex].classList.add("note-is-playing");
            if (this._noteSelects[trackIndex][noteIndex - 1]) {
                this._noteSelects[trackIndex][noteIndex - 1].classList.remove("note-is-playing");
            }
            else {
                this._noteSelects[trackIndex][NOTE_INPUT_COUNT - 1].classList.remove("note-is-playing");
            }
        }
    };
    NoteSelectHandler.prototype.setNoteLengthDisplay = function (trackIndex, noteIndex) {
        // console.log("Setting disaplay", trackIndex, noteIndex);
        var displayElem = document.getElementById("note-length-display-" + trackIndex + "-" + (noteIndex + 1));
        displayElem.innerHTML = this._noteLengthSliders[trackIndex][noteIndex].value;
    };
    return NoteSelectHandler;
}());
exports.NoteSelectHandler = NoteSelectHandler;
var emptyElement = function (element) {
    while (element.firstElementChild) {
        element.firstElementChild.remove();
    }
};
/**
 * Create a new row of note inputs in the note select table.
 *
 * @param {HTMLTableElement} noteSelectsTable - The table element from the DOM.
 * @param {function} handleNoteSelectChange - A callback to handle note value changes.
 */
var createNoteSelectRow = function (noteSelectsTable, trackIndex, handleNoteSelectChange, handleNoteDurationChange, handleTrackMutedChange, handleTrackSelectChange) {
    // Create the table row
    var noteTableRow = document.createElement("tr");
    noteTableRow.classList.add("noteTableRow", "noteTableRow-" + trackIndex);
    // Create the leftest option cell (for muting tracks)
    var labelCell = document.createElement("td");
    labelCell.classList.add("align-top");
    var labelCellDiv = document.createElement("div");
    // IS-MUSTED CHECKBOX
    var mutedCheckbox = document.createElement("input");
    mutedCheckbox.setAttribute("type", "checkbox");
    mutedCheckbox.setAttribute("id", "ismuted-checkbox-" + trackIndex);
    mutedCheckbox.classList.add("ismuted-checkbox");
    mutedCheckbox.addEventListener("change", function (event) {
        handleTrackMutedChange(trackIndex, event.currentTarget.checked);
    });
    var mutedCheckboxLabel = document.createElement("label");
    mutedCheckboxLabel.setAttribute("for", "ismuted-checkbox-" + trackIndex);
    labelCellDiv.appendChild(mutedCheckbox);
    labelCellDiv.appendChild(mutedCheckboxLabel);
    labelCell.classList.add("align-center");
    labelCell.appendChild(labelCellDiv);
    noteTableRow.appendChild(labelCell);
    var activeRadiobox = document.createElement("input");
    activeRadiobox.setAttribute("type", "radio");
    activeRadiobox.setAttribute("id", "isactive-radio-" + trackIndex);
    activeRadiobox.setAttribute("name", "isactive-radio");
    if (trackIndex === 0) {
        console.log("tackIndex", 0);
        activeRadiobox.checked = true;
        noteTableRow.classList.add("selected-track");
    }
    // IS-ACTIVE RADIO
    activeRadiobox.classList.add("isactive-radio");
    activeRadiobox.addEventListener("change", function (event) {
        console.log("event.currentTarget", event.target);
        handleTrackSelectChange(trackIndex, event.target.checked);
    });
    var activeRadioboxLabel = document.createElement("label");
    activeRadioboxLabel.setAttribute("for", "isactive-radio-" + trackIndex);
    labelCellDiv.appendChild(activeRadiobox);
    labelCellDiv.appendChild(activeRadioboxLabel);
    labelCell.classList.add("align-center");
    labelCell.appendChild(labelCellDiv);
    noteTableRow.appendChild(labelCell);
    // Now create n cells for n notes
    for (var i = 0; i < NOTE_INPUT_COUNT; i++) {
        var select = document.createElement("select");
        select.id = "note " + (i + 1);
        select.setAttribute("data-index", "" + i);
        select.setAttribute("data-trackIndex", "" + trackIndex);
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
        lengthSlider.classList.add("note_duration_slider_" + trackIndex);
        lengthSlider.classList.add("note_duration_slider_" + trackIndex + "-" + (i + 1));
        lengthSlider.value = "1.0";
        lengthSlider.step = "0.1";
        lengthSlider.addEventListener("input", function () {
            handleNoteDurationChange();
        });
        var sliderValueDisplay = document.createElement("span");
        sliderValueDisplay.innerHTML = "1.0";
        sliderValueDisplay.id = "note-length-display-" + trackIndex + "-" + (i + 1);
        sliderValueDisplay.classList.add("value-display");
        var noteFrquencyDisplay = document.createElement("div");
        noteFrquencyDisplay.classList.add("note-frequency-display");
        noteFrquencyDisplay.setAttribute("id", "note-frequency-display-" + trackIndex + "-" + i);
        noteFrquencyDisplay.innerHTML = "test";
        var noteCell = document.createElement("td");
        var noteCellDiv = document.createElement("div");
        noteCellDiv.classList.add("align-center");
        noteCellDiv.appendChild(sliderValueDisplay);
        noteCellDiv.appendChild(lengthSlider);
        noteCellDiv.appendChild(noteFrquencyDisplay);
        noteCellDiv.appendChild(select);
        noteCell.appendChild(noteCellDiv);
        noteTableRow.appendChild(noteCell);
    } // END for
    noteSelectsTable.appendChild(noteTableRow);
    // Create the rightest info cell
    labelCell = document.createElement("td");
    labelCell.classList.add("align-top");
    labelCellDiv = document.createElement("div");
    labelCellDiv.innerHTML = "dur ×";
    labelCell.classList.add("align-center", "vertical-text");
    labelCell.appendChild(labelCellDiv);
    noteTableRow.appendChild(labelCell);
};
NoteSelectHandler.NOTE_INPUT_COUNT = NOTE_INPUT_COUNT;
//# sourceMappingURL=NoteSelectHandler.js.map