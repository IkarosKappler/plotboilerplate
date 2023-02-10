/**
 * Inspired by
 *    https://medium.com/geekculture/building-a-modular-synth-with-web-audio-api-and-javascript-d38ccdeca9ea
 *
 * @author  Ikaros Kappler
 * @date    2023-01-27
 * @modified 2023-02-04 Ported to Typescript.
 * @version 1.0.1
 */

import { Note, NoteConfig, Track, TrackPreset } from "./interfaces";
import { getNoteByIndex, noteValues } from "./noteValues";
import { convertPresetToNotes } from "./presets";

const NOTE_INPUT_COUNT = 16;

export class NoteSelectHandler {
  // currentNotes: Array<NoteConfig[]>;
  tracks: Array<Track>;
  trackCount: number;
  isTrackMuted: Array<boolean>;

  private _noteSelects: Array<NodeListOf<HTMLSelectElement>>;
  private _noteLengthSliders: Array<NodeListOf<HTMLInputElement>>;

  static NOTE_INPUT_COUNT: number;

  constructor(initialPreset: TrackPreset, trackCount?: number) {
    this.trackCount = trackCount || 1;
    if (typeof trackCount === "undefined") {
      console.info("[NoteSelectHandler] `trackCount` not provided, using default setting 1.");
    }
    this._createNoteSelectsDOM(initialPreset);
  }

  private _createNoteSelectsDOM(preset) {
    this.setCurrentNotesFromPreset(preset);
    var _self = this;
    function handleNoteSelectChange(event) {
      console.log("event", event, event.target.value);
      var noteIndex = event.target.value;
      var selectTrackIndex = event.target.getAttribute("data-trackIndex");
      console.log("selectTrackIndex", selectTrackIndex);
      var selectIndex = event.target.getAttribute("data-index");
      for (var trackIndex = 0; trackIndex < this.trackCount; trackIndex++) {
        // _self.currentNotes[selectTrackIndex][selectIndex].noteIndex = noteIndex;
        _self.tracks[selectTrackIndex].currentNotes[selectIndex].noteIndex = noteIndex;
      }
      var note = getNoteByIndex(noteIndex);
      _self._noteSelects[selectTrackIndex][selectIndex].setAttribute("title", `${note.identifier} @${note.frequency}Hz`);
    }

    function handleNoteDurationChange() {
      _self.setCurrentNoteLengths();
    }

    var handleTrackMutedChange = (trackIndex: number, isChecked: boolean) => {
      console.log("is muted", isChecked);
      this.isTrackMuted[trackIndex] = isChecked;
    };

    const handleTrackSelectedChange = (trackIndex: number, checked: boolean) => {
      console.log("checked", checked);
      // if (checked) {
      //   noteTableRow.classList.add("selected-track");
      // } else {
      //   console.log("Remove class");
      //   noteTableRow.classList.remove("selected-track");
      // }
      for (var t = 0; t < this.trackCount; t++) {
        if (t != trackIndex) {
          document.querySelector(`.noteTableRow-${t}`)?.classList.remove("selected-track");
        }
        // noteTableRow", `noteTableRow-${trackIndex}`)
      }
      document.querySelector(`.noteTableRow-${trackIndex}`)?.classList.add("selected-track");
    };

    const noteSelectsTable = document.querySelector("#note-selects-table") as HTMLTableElement;
    emptyElement(noteSelectsTable);
    this._noteSelects = [];
    this.isTrackMuted = [];
    for (var trackIndex = 0; trackIndex < this.trackCount; trackIndex++) {
      createNoteSelectRow(
        noteSelectsTable,
        trackIndex,
        handleNoteSelectChange,
        handleNoteDurationChange,
        handleTrackMutedChange,
        handleTrackSelectedChange
      );
      this._noteSelects[trackIndex] = document.querySelectorAll(`select[data-trackindex='${trackIndex}'].note-select`);
      this.isTrackMuted.push(false);
    }

    this._noteLengthSliders = [];
    for (var trackIndex = 0; trackIndex < this.trackCount; trackIndex++) {
      this._noteLengthSliders.push(document.querySelectorAll(`input[type=range].note_duration_slider_${trackIndex}`));
    }
    console.log("noteLengthSliders", this._noteLengthSliders.length);

    this.setCurrentNoteLengthInputs();
    this.setNoteSelects();
  }

  setTrackCount(preset: TrackPreset, newTrackCount: number) {
    this.trackCount = newTrackCount;
    this._createNoteSelectsDOM(preset);
    this.setCurrentNotesFromPreset(preset);
  }

  setCurrentNotesFromPreset(preset: TrackPreset) {
    // this.currentNotes = [];
    this.tracks = [];
    for (var trackIndex = 0; trackIndex < this.trackCount; trackIndex++) {
      const track: Track = { currentNotes: [] };
      this.tracks.push(track);
      track.currentNotes = convertPresetToNotes(NOTE_INPUT_COUNT, preset.noteValues);
      if (trackIndex === 1) {
        // For testing: transpose the first track one octave down
        for (var i = 0; i < track.currentNotes.length; i++) {
          track.currentNotes[i].noteIndex -= 12;
        }
      }
    }
  }

  setFromPreset(preset: TrackPreset) {
    this.setCurrentNotesFromPreset(preset);
    console.log("Applying notes from preset");
    this.setCurrentNoteLengthInputs();
    this.setNoteSelects();
  }

  setNoteSelects() {
    for (var trackIndex = 0; trackIndex < this.trackCount; trackIndex++) {
      // for (let i = 0; i < this.currentNotes[trackIndex].length; i++) {
      for (let i = 0; i < this.tracks[trackIndex].currentNotes.length; i++) {
        // const noteIndex = this.currentNotes[trackIndex][i].noteIndex;
        const noteIndex = this.tracks[trackIndex].currentNotes[i].noteIndex;

        // console.log("i noteIndex", i, noteIndex);
        this._noteSelects[trackIndex][i].value = `${noteIndex}`;
        const noteIdentifier = Object.keys(noteValues)[noteIndex];
        const noteFrequency = noteValues[noteIdentifier];
        this._noteSelects[trackIndex][i].setAttribute("title", `${noteIdentifier} @${noteFrequency}Hz`);
      }
    }
  }

  setCurrentNotes() {
    for (var trackIndex = 0; trackIndex < this.trackCount; trackIndex++) {
      for (let i = 0; i < this._noteSelects.length; i++) {
        // this.currentNotes[trackIndex][i].noteIndex = Number(this._noteSelects[trackIndex][i].value);
        this.tracks[trackIndex].currentNotes[i].noteIndex = Number(this._noteSelects[trackIndex][i].value);
      }
    }
  }

  setCurrentNoteLengthInputs() {
    for (var trackIndex = 0; trackIndex < this.trackCount; trackIndex++) {
      for (let i = 0; i < this._noteLengthSliders[trackIndex].length; i++) {
        // this._noteLengthSliders[trackIndex][i].value = String(this.currentNotes[trackIndex][i].lengthFactor);
        this._noteLengthSliders[trackIndex][i].value = String(this.tracks[trackIndex].currentNotes[i].lengthFactor);

        this.setNoteLengthDisplay(trackIndex, i);
      }
    }
    console.log("this.tracks", this.tracks);
  }

  setCurrentNoteLengths() {
    for (var trackIndex = 0; trackIndex < this.trackCount; trackIndex++) {
      for (let i = 0; i < this._noteLengthSliders[trackIndex].length; i++) {
        // console.log("i", i, "this._noteLengthSliders[trackIndex][i].value", this._noteLengthSliders[trackIndex][i].value);
        this.setNoteLengthDisplay(trackIndex, i);
        // this.currentNotes[trackIndex][i].lengthFactor = Number(this._noteLengthSliders[trackIndex][i].value);
        this.tracks[trackIndex].currentNotes[i].lengthFactor = Number(this._noteLengthSliders[trackIndex][i].value);
      }
    }
    console.log("this.tracks", this.tracks);
  }

  setPlayingNoteIndex(noteIndex: number) {
    for (var trackIndex = 0; trackIndex < this.trackCount; trackIndex++) {
      this._noteSelects[trackIndex][noteIndex].classList.add("note-is-playing");
      if (this._noteSelects[trackIndex][noteIndex - 1]) {
        this._noteSelects[trackIndex][noteIndex - 1].classList.remove("note-is-playing");
      } else {
        this._noteSelects[trackIndex][NOTE_INPUT_COUNT - 1].classList.remove("note-is-playing");
      }
    }
  }
  setNoteLengthDisplay(trackIndex: number, noteIndex: number) {
    console.log("Setting disaplay", trackIndex, noteIndex);
    const displayElem = document.getElementById(`note-length-display-${trackIndex}-${noteIndex + 1}`) as HTMLElement;
    displayElem.innerHTML = this._noteLengthSliders[trackIndex][noteIndex].value;
  }
}

const emptyElement = (element: Element) => {
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
const createNoteSelectRow = (
  noteSelectsTable: HTMLTableElement,
  trackIndex: number,
  handleNoteSelectChange,
  handleNoteDurationChange,
  handleTrackMutedChange: (trackIndex: number, checked: boolean) => void,
  handleTrackSelectChange: (trackIndex: number, checked: boolean) => void
) => {
  // Create the table row
  const noteTableRow = document.createElement("tr");
  noteTableRow.classList.add("noteTableRow", `noteTableRow-${trackIndex}`);

  // Create the leftest option cell (for muting tracks)
  var labelCell = document.createElement("td");
  labelCell.classList.add("align-top");
  var labelCellDiv = document.createElement("div");
  const mutedCheckbox = document.createElement("input");
  mutedCheckbox.setAttribute("type", "checkbox");
  mutedCheckbox.setAttribute("id", `ismuted-checkbox-${trackIndex}`);
  mutedCheckbox.classList.add("ismuted-checkbox");
  mutedCheckbox.addEventListener("change", (event: Event) => {
    handleTrackMutedChange(trackIndex, (event.currentTarget as HTMLInputElement).checked);
  });
  var mutedCheckboxLabel = document.createElement("label");
  mutedCheckboxLabel.setAttribute("for", `ismuted-checkbox-${trackIndex}`);
  labelCellDiv.appendChild(mutedCheckbox);
  labelCellDiv.appendChild(mutedCheckboxLabel);
  labelCell.classList.add("align-center");
  labelCell.appendChild(labelCellDiv);
  noteTableRow.appendChild(labelCell);

  const activeRadiobox = document.createElement("input");
  activeRadiobox.setAttribute("type", "radio");
  activeRadiobox.setAttribute("id", `isactive-radio-${trackIndex}`);
  activeRadiobox.setAttribute("name", `isactive-radio`);
  if (trackIndex === 0) {
    console.log("tackIndex", 0);
    activeRadiobox.checked = true;
    noteTableRow.classList.add("selected-track");
  }
  // const handleTrackSelectedChange = (trackIndex: number, checked: boolean) => {
  //   console.log("checked", checked);
  //   if (checked) {
  //     noteTableRow.classList.add("selected-track");
  //   } else {
  //     console.log("Remove class");
  //     noteTableRow.classList.remove("selected-track");
  //   }
  // };
  activeRadiobox.classList.add("isactive-radio");
  activeRadiobox.addEventListener("change", (event: Event) => {
    console.log("event.currentTarget", event.target);
    handleTrackSelectChange(trackIndex, (event.target as HTMLInputElement).checked);
  });
  var activeRadioboxLabel = document.createElement("label");
  activeRadioboxLabel.setAttribute("for", `isactive-radio-${trackIndex}`);
  labelCellDiv.appendChild(activeRadiobox);
  labelCellDiv.appendChild(activeRadioboxLabel);
  labelCell.classList.add("align-center");
  labelCell.appendChild(labelCellDiv);
  noteTableRow.appendChild(labelCell);

  // Now create n cells for n notes
  for (let i = 0; i < NOTE_INPUT_COUNT; i++) {
    const select = document.createElement("select");
    select.id = `note ${i + 1}`;
    select.setAttribute("data-index", `${i}`);
    select.setAttribute("data-trackIndex", `${trackIndex}`);
    select.classList.add("note-select");
    for (let j = 0; j < Object.keys(noteValues).length; j++) {
      const option = document.createElement("option");
      option.value = `${j}`;
      option.innerText = `${Object.keys(noteValues)[j]}`;
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
    lengthSlider.classList.add(`note_duration_slider_${trackIndex}`);
    lengthSlider.classList.add(`note_duration_slider_${trackIndex}-${i + 1}`);
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
    sliderValueDisplay.id = `note-length-display-${trackIndex}-${i + 1}`;
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
  labelCell = document.createElement("td");
  labelCell.classList.add("align-top");
  labelCellDiv = document.createElement("div");
  labelCellDiv.innerHTML = "dur ×";
  labelCell.classList.add("align-center", "vertical-text");
  labelCell.appendChild(labelCellDiv);
  noteTableRow.appendChild(labelCell);
};

NoteSelectHandler.NOTE_INPUT_COUNT = NOTE_INPUT_COUNT;
