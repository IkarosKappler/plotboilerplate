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
var DEFAULT_NOTE_INPUT_COUNT = 16;
var NoteSelectHandler = /** @class */ (function () {
    function NoteSelectHandler(initialPreset, trackCount, onTrackSelected) {
        this.trackCount = trackCount || 1;
        this.selectedTrackIndex = 0;
        this.noteInputCount = DEFAULT_NOTE_INPUT_COUNT;
        this._onTrackSelected = onTrackSelected;
        if (typeof trackCount === "undefined") {
            console.info("[NoteSelectHandler] `trackCount` not provided, using default setting 1.");
        }
        this._createNoteSelectsDOM(initialPreset, initialPreset.noteValues.length);
    }
    NoteSelectHandler.prototype.getNotesIOFormat = function () {
        return {
            tracks: this.tracks.map(function (track) {
                return track2Preset(track); // cloneTrack(track);
            }),
            trackCount: this.trackCount,
            noteInputCount: this.noteInputCount,
            isTrackMuted: this.tracks.map(function (track) {
                return track.isMuted;
            })
        };
    };
    /**
     * Create/Recreate the whole note selector table DOM.
     *
     * @param {TrackPreset} preset
     * @param {number} noteInputCount
     */
    NoteSelectHandler.prototype._createNoteSelectsDOM = function (preset, noteInputCount) {
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
            if (note) {
                _self._noteSelects[affectedTrackIndex][selectIndex].setAttribute("title", note.identifier + " @" + note.frequency + "Hz");
                _self.setCurrentNoteFreuqencyDisplays();
            }
            else {
                console.warn("Cannot handle note select change. noteIndex is invalid:", noteIndex);
            }
        };
        var handleNoteDurationChange = function (_inputElement, _noteIndex) {
            console.log("Handle note length", _noteIndex);
            _self.setCurrentNoteLengths();
        };
        var handleTrackMutedChange = function (trackIndex, isChecked) {
            console.log("is muted", isChecked);
            // this.isTrackMuted[trackIndex] = isChecked;
            _this.tracks[trackIndex].isMuted = isChecked;
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
        // this.isTrackMuted = [];
        for (var trackIndex = 0; trackIndex < this.trackCount; trackIndex++) {
            createNoteSelectRow(noteSelectsTable, trackIndex, noteInputCount, handleNoteSelectChange, handleNoteDurationChange, handleTrackMutedChange, handleTrackSelectedChange);
            this._noteSelects[trackIndex] = document.querySelectorAll("select[data-trackindex='" + trackIndex + "'].note-select");
            // this.isTrackMuted.push(false);
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
    NoteSelectHandler.prototype.setTrackCount = function (preset, newTrackCount, newNoteInputCount) {
        console.log("setTrackCount", newTrackCount, "newNoteInputCount", newNoteInputCount);
        this.trackCount = newTrackCount;
        this.noteInputCount = newNoteInputCount;
        this._createNoteSelectsDOM(preset, newNoteInputCount);
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
                vibratoValues: cloneObject_1.cloneObject(preset.vibratoValues),
                // delayValues: cloneObject(preset.delayValues)
                isMuted: false
            };
            // track.envelope = { preset.envelope};
            this.tracks.push(track);
            // track.currentNotes = convertPresetToNotes(DEFAULT_NOTE_INPUT_COUNT, preset.noteValues);
            track.currentNotes = presets_1.convertPresetToNotes(this.noteInputCount, preset.noteValues);
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
    // Note At least one track must be present
    // Note: all presets must have same length
    NoteSelectHandler.prototype.setTracks = function (noteValues) {
        if (noteValues.tracks.length === 0) {
            console.log("[NoteSelectHandler] Cannot load tracks (not track data given).");
            return;
        }
        this.tracks = [];
        this.trackCount = noteValues.trackCount;
        this.noteInputCount = noteValues.noteInputCount;
        this.selectedTrackIndex = 0;
        var selectedPreset = noteValues.tracks[this.selectedTrackIndex];
        this._createNoteSelectsDOM(selectedPreset, this.noteInputCount);
        for (var trackIndex = 0; trackIndex < this.trackCount; trackIndex++) {
            // Important: create clones here (we don't want to change the preset if
            //   the track settings get changed)
            var preset = noteValues.tracks[trackIndex];
            var trackIsMuted = trackIndex >= 0 && trackIndex < noteValues.isTrackMuted.length ? noteValues.isTrackMuted[trackIndex] : false;
            var track = {
                currentNotes: presets_1.convertPresetToNotes(this.noteInputCount, preset.noteValues),
                envelope: cloneObject_1.cloneObject(preset.envelope),
                mainValues: cloneObject_1.cloneObject(preset.mainValues),
                oscillator: cloneObject_1.cloneObject(preset.oscillator),
                vibratoValues: cloneObject_1.cloneObject(preset.vibratoValues),
                // delayValues: cloneObject(preset.delayValues)
                isMuted: trackIsMuted //  false
            };
            // const track : Track = noteValues.tracks[trackIndex];
            // track.envelope = { preset.envelope};
            this.tracks.push(track);
            // track.currentNotes = convertPresetToNotes(DEFAULT_NOTE_INPUT_COUNT, preset.noteValues);
            // track.currentNotes = convertPresetToNotes(this.noteInputCount, preset.noteValues);
            // if (trackIndex === 1) {
            //   // For testing: transpose the first track one octave down
            //   for (var i = 0; i < track.currentNotes.length; i++) {
            //     track.currentNotes[i].noteIndex -= 12;
            //   }
            // }
        }
        this.setCurrentNoteLengthInputs();
        this.setNoteSelects();
        this.setCurrentNoteFreuqencyDisplays();
        this._onTrackSelected(this.tracks[this.selectedTrackIndex], this.selectedTrackIndex);
    };
    NoteSelectHandler.prototype.setNoteSelects = function () {
        for (var trackIndex = 0; trackIndex < this.trackCount; trackIndex++) {
            for (var i = 0; i < this.tracks[trackIndex].currentNotes.length; i++) {
                var noteIndex = this.tracks[trackIndex].currentNotes[i].noteIndex;
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
                this.tracks[trackIndex].currentNotes[i].noteIndex = Number(this._noteSelects[trackIndex][i].value);
            }
        }
    };
    NoteSelectHandler.prototype.setCurrentNoteLengthInputs = function () {
        for (var trackIndex = 0; trackIndex < this.trackCount; trackIndex++) {
            for (var i = 0; i < this.noteInputCount; i++) {
                console.log("i", i, "trackIndex", trackIndex, this.tracks[trackIndex].currentNotes);
                this._noteLengthSliders[trackIndex][i].value = String(this.tracks[trackIndex].currentNotes[i].lengthFactor);
                this.setNoteLengthDisplay(trackIndex, i);
            }
        }
        console.log("this.tracks", this.tracks);
    };
    /**
     * Update all displays for note length.
     */
    NoteSelectHandler.prototype.setCurrentNoteFreuqencyDisplays = function () {
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
    /**
     * Set the stored note length from the settings in the note sliders.
     */
    NoteSelectHandler.prototype.setCurrentNoteLengths = function () {
        for (var trackIndex = 0; trackIndex < this.trackCount; trackIndex++) {
            for (var i = 0; i < this._noteLengthSliders[trackIndex].length; i++) {
                this.setNoteLengthDisplay(trackIndex, i);
                this.tracks[trackIndex].currentNotes[i].lengthFactor = Number(this._noteLengthSliders[trackIndex][i].value);
            }
        }
        console.log("this.tracks", this.tracks);
    };
    NoteSelectHandler.prototype.setPlayingNoteDisplay = function (playingNoteIndex) {
        for (var trackIndex = 0; trackIndex < this.trackCount; trackIndex++) {
            for (var noteIndex = 0; noteIndex < this._noteSelects[trackIndex].length; noteIndex++) {
                if (playingNoteIndex === noteIndex) {
                    this._noteSelects[trackIndex][noteIndex].classList.add("note-is-playing");
                }
                else {
                    this._noteSelects[trackIndex][noteIndex].classList.remove("note-is-playing");
                }
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
var createNoteSelectRow = function (noteSelectsTable, trackIndex, noteInputCount, handleNoteSelectChange, handleNoteDurationChange, handleTrackMutedChange, handleTrackSelectChange) {
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
    for (var i = 0; i < noteInputCount; i++) {
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
            // select.addEventListener("change", (event:Event) => {});
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
        var noteDurationChangeHandler = function (lengthSlider, noteIndex) {
            return function () { return handleNoteDurationChange(lengthSlider, noteIndex); };
        };
        lengthSlider.addEventListener("input", noteDurationChangeHandler(lengthSlider, i));
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
NoteSelectHandler.DEFAULT_NOTE_INPUT_COUNT = DEFAULT_NOTE_INPUT_COUNT;
// const cloneTrack = (track: Track): Track => {
//   return {
//     envelope: cloneObject(track.envelope),
//     mainValues: cloneObject(track.mainValues),
//     oscillator: cloneObject(track.oscillator),
//     vibratoValues: cloneObject(track.vibratoValues),
//     currentNotes: cloneArray(track.currentNotes),
//     isMuted: track.isMuted
//   };
// };
var track2Preset = function (track) {
    return {
        envelope: cloneObject_1.cloneObject(track.envelope),
        mainValues: cloneObject_1.cloneObject(track.mainValues),
        oscillator: cloneObject_1.cloneObject(track.oscillator),
        vibratoValues: cloneObject_1.cloneObject(track.vibratoValues),
        // currentNotes: cloneArray(track.currentNotes),
        noteValues: track.currentNotes.map(function (noteConfig) {
            var note = noteValues_1.getNoteByIndex(noteConfig.noteIndex);
            return { value: note ? note.identifier : "", lengthFactor: noteConfig.lengthFactor };
        })
        // isMuted: track.isMuted
    };
};
var cloneArray = function (arr) {
    return arr.map(function (elem) { return elem; });
};
// const cloneObject = <T>(onbj: T): T => {
//   return Object.assign({}, onbj);
// };
//# sourceMappingURL=NoteSelectHandler.js.map