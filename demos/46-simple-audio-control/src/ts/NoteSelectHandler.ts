/**
 * Inspired by
 *    https://medium.com/geekculture/building-a-modular-synth-with-web-audio-api-and-javascript-d38ccdeca9ea
 *
 * @author   Ikaros Kappler
 * @date     2023-01-27
 * @modified 2023-02-04 Ported to Typescript.
 * @version  1.0.1
 */

import { cloneObject } from "./cloneObject";
import { NoteConfig, NotesIOFormat, Track, TrackPreset } from "./interfaces";
import { getNoteByIndex, noteValues } from "./noteValues";
import { convertPresetToNotes } from "./presets";

const DEFAULT_NOTE_INPUT_COUNT = 16;

export class NoteSelectHandler {
  tracks: Array<Track>;
  trackCount: number;
  // isTrackMuted: Array<boolean>;
  selectedTrackIndex: number;
  noteInputCount: number;
  private _onTrackSelected: (selectedTrack: Track, selectedTrackIndex: number) => void;

  private _noteSelects: Array<NodeListOf<HTMLSelectElement>>;
  private _noteLengthSliders: Array<NodeListOf<HTMLInputElement>>;

  static DEFAULT_NOTE_INPUT_COUNT: number;

  constructor(
    initialPreset: TrackPreset,
    trackCount: number,
    onTrackSelected: (selectedTrack: Track, selectedTrackIndex: number) => void
  ) {
    this.trackCount = trackCount || 1;
    this.selectedTrackIndex = 0;
    this.noteInputCount = DEFAULT_NOTE_INPUT_COUNT;
    this._onTrackSelected = onTrackSelected;
    if (typeof trackCount === "undefined") {
      console.info("[NoteSelectHandler] `trackCount` not provided, using default setting 1.");
    }
    this._createNoteSelectsDOM(initialPreset, initialPreset.noteValues.length);
  }

  getNotesIOFormat(): NotesIOFormat {
    return {
      tracks: this.tracks.map((track: Track) => {
        return track2Preset(track); // cloneTrack(track);
      }),
      trackCount: this.trackCount,
      noteInputCount: this.noteInputCount,
      isTrackMuted: this.tracks.map((track: Track) => {
        return track.isMuted;
      })
    };
  }

  /**
   * Create/Recreate the whole note selector table DOM.
   *
   * @param {TrackPreset} preset
   * @param {number} noteInputCount
   */
  private _createNoteSelectsDOM(preset: TrackPreset, noteInputCount: number) {
    this.setCurrentNotesFromPreset(preset);
    const _self = this;
    const handleNoteSelectChange = event => {
      console.log("event", event, event.target.value);
      const noteIndex = event.target.value;
      const affectedTrackIndex = event.target.getAttribute("data-trackIndex");
      console.log("affectedTrackIndex", affectedTrackIndex);
      const selectIndex = event.target.getAttribute("data-index");
      for (var trackIndex = 0; trackIndex < _self.trackCount; trackIndex++) {
        // _self.currentNotes[selectTrackIndex][selectIndex].noteIndex = noteIndex;
        _self.tracks[affectedTrackIndex].currentNotes[selectIndex].noteIndex = noteIndex;
      }
      const note = getNoteByIndex(noteIndex);
      if (note) {
        _self._noteSelects[affectedTrackIndex][selectIndex].setAttribute("title", `${note.identifier} @${note.frequency}Hz`);
        _self.setCurrentNoteFreuqencyDisplays();
      } else {
        console.warn("Cannot handle note select change. noteIndex is invalid:", noteIndex);
      }
    };

    const handleNoteDurationChange = (_inputElement: HTMLInputElement, _noteIndex: number) => {
      console.log("Handle note length", _noteIndex);
      _self.setCurrentNoteLengths();
    };

    var handleTrackMutedChange = (trackIndex: number, isChecked: boolean) => {
      console.log("is muted", isChecked);
      // this.isTrackMuted[trackIndex] = isChecked;
      this.tracks[trackIndex].isMuted = isChecked;
    };

    const handleTrackSelectedChange = (trackIndex: number, checked: boolean) => {
      for (var t = 0; t < this.trackCount; t++) {
        if (t != trackIndex) {
          document.querySelector(`.noteTableRow-${t}`)?.classList.remove("selected-track");
        }
      }
      document.querySelector(`.noteTableRow-${trackIndex}`)?.classList.add("selected-track");
      this.selectedTrackIndex = trackIndex;
      _self._onTrackSelected(_self.tracks[_self.selectedTrackIndex], _self.selectedTrackIndex);
    };

    const noteSelectsTable = document.querySelector("#note-selects-table") as HTMLTableElement;
    emptyElement(noteSelectsTable);
    this._noteSelects = [];
    // this.isTrackMuted = [];
    for (var trackIndex = 0; trackIndex < this.trackCount; trackIndex++) {
      createNoteSelectRow(
        noteSelectsTable,
        trackIndex,
        noteInputCount,
        handleNoteSelectChange,
        handleNoteDurationChange,
        handleTrackMutedChange,
        handleTrackSelectedChange
      );
      this._noteSelects[trackIndex] = document.querySelectorAll(`select[data-trackindex='${trackIndex}'].note-select`);
      // this.isTrackMuted.push(false);
    }

    this._noteLengthSliders = [];
    for (var trackIndex = 0; trackIndex < this.trackCount; trackIndex++) {
      this._noteLengthSliders.push(document.querySelectorAll(`input[type=range].note_duration_slider_${trackIndex}`));
    }
    console.log("noteLengthSliders", this._noteLengthSliders.length);

    this.setCurrentNoteLengthInputs();
    this.setNoteSelects();
    this.setCurrentNoteFreuqencyDisplays();
  }

  setTrackCount(preset: TrackPreset, newTrackCount: number, newNoteInputCount: number) {
    console.log("setTrackCount", newTrackCount, "newNoteInputCount", newNoteInputCount);
    this.trackCount = newTrackCount;
    this.noteInputCount = newNoteInputCount;
    this._createNoteSelectsDOM(preset, newNoteInputCount);
    this.setCurrentNotesFromPreset(preset);
  }

  setCurrentNotesFromPreset(preset: TrackPreset) {
    this.tracks = [];
    for (var trackIndex = 0; trackIndex < this.trackCount; trackIndex++) {
      // Important: create clones here (we don't want to change the preset if
      //   the track settings get changed)
      const track: Track = {
        currentNotes: [],
        envelope: cloneObject(preset.envelope),
        mainValues: cloneObject(preset.mainValues),
        oscillator: cloneObject(preset.oscillator),
        vibratoValues: cloneObject(preset.vibratoValues),
        // delayValues: cloneObject(preset.delayValues)
        isMuted: false
      };
      // track.envelope = { preset.envelope};
      this.tracks.push(track);
      // track.currentNotes = convertPresetToNotes(DEFAULT_NOTE_INPUT_COUNT, preset.noteValues);
      track.currentNotes = convertPresetToNotes(this.noteInputCount, preset.noteValues);
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
    this.setCurrentNoteFreuqencyDisplays();
  }

  // Note At least one track must be present
  // Note: all presets must have same length
  setTracks(noteValues: NotesIOFormat) {
    if (noteValues.tracks.length === 0) {
      console.log("[NoteSelectHandler] Cannot load tracks (not track data given).");
      return;
    }
    this.tracks = [];
    this.trackCount = noteValues.trackCount;
    this.noteInputCount = noteValues.noteInputCount;
    this.selectedTrackIndex = 0;
    const selectedPreset = noteValues.tracks[this.selectedTrackIndex];
    this._createNoteSelectsDOM(selectedPreset, this.noteInputCount);
    for (var trackIndex = 0; trackIndex < this.trackCount; trackIndex++) {
      // Important: create clones here (we don't want to change the preset if
      //   the track settings get changed)
      const preset: TrackPreset = noteValues.tracks[trackIndex];
      const trackIsMuted =
        trackIndex >= 0 && trackIndex < noteValues.isTrackMuted.length ? noteValues.isTrackMuted[trackIndex] : false;
      const track: Track = {
        currentNotes: convertPresetToNotes(this.noteInputCount, preset.noteValues),
        envelope: cloneObject(preset.envelope),
        mainValues: cloneObject(preset.mainValues),
        oscillator: cloneObject(preset.oscillator),
        vibratoValues: cloneObject(preset.vibratoValues),
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
  }

  setNoteSelects() {
    for (var trackIndex = 0; trackIndex < this.trackCount; trackIndex++) {
      for (let i = 0; i < this.tracks[trackIndex].currentNotes.length; i++) {
        const noteIndex = this.tracks[trackIndex].currentNotes[i].noteIndex;
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
        this.tracks[trackIndex].currentNotes[i].noteIndex = Number(this._noteSelects[trackIndex][i].value);
      }
    }
  }

  setCurrentNoteLengthInputs() {
    for (var trackIndex = 0; trackIndex < this.trackCount; trackIndex++) {
      for (let i = 0; i < this.noteInputCount; i++) {
        // console.log("i", i, "trackIndex", trackIndex, this.tracks[trackIndex].currentNotes);
        this._noteLengthSliders[trackIndex][i].value = String(this.tracks[trackIndex].currentNotes[i].lengthFactor);
        this.setNoteLengthDisplay(trackIndex, i);
      }
    }
    console.log("this.tracks", this.tracks);
  }

  /**
   * Update all displays for note length.
   */
  setCurrentNoteFreuqencyDisplays() {
    for (var trackIndex = 0; trackIndex < this.trackCount; trackIndex++) {
      for (let i = 0; i < this._noteLengthSliders[trackIndex].length; i++) {
        const noteIndex = this.tracks[trackIndex].currentNotes[i].noteIndex;
        const note = getNoteByIndex(noteIndex);
        const noteFrequencyDisplay = document.querySelector(`#note-frequency-display-${trackIndex}-${i}`) as HTMLDivElement;
        if (typeof noteIndex === "undefined" || noteIndex < 0 || !note) {
          noteFrequencyDisplay.innerHTML = "&nbsp;";
        } else {
          noteFrequencyDisplay.innerHTML = `${note.frequency}`;
        }
      }
    }
  }

  /**
   * Set the stored note length from the settings in the note sliders.
   */
  setCurrentNoteLengths() {
    for (var trackIndex = 0; trackIndex < this.trackCount; trackIndex++) {
      for (let i = 0; i < this._noteLengthSliders[trackIndex].length; i++) {
        this.setNoteLengthDisplay(trackIndex, i);
        this.tracks[trackIndex].currentNotes[i].lengthFactor = Number(this._noteLengthSliders[trackIndex][i].value);
      }
    }
    console.log("this.tracks", this.tracks);
  }

  setPlayingNoteDisplay(playingNoteIndex: number) {
    for (var trackIndex = 0; trackIndex < this.trackCount; trackIndex++) {
      for (var noteIndex = 0; noteIndex < this._noteSelects[trackIndex].length; noteIndex++) {
        if (playingNoteIndex === noteIndex) {
          this._noteSelects[trackIndex][noteIndex].classList.add("note-is-playing");
        } else {
          this._noteSelects[trackIndex][noteIndex].classList.remove("note-is-playing");
        }
      }
    }
  }
  setNoteLengthDisplay(trackIndex: number, noteIndex: number) {
    // console.log("Setting disaplay", trackIndex, noteIndex);
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
  noteInputCount: number,
  handleNoteSelectChange: (event: Event) => void,
  handleNoteDurationChange: (inputElement: HTMLInputElement, noteIndex: number) => void,
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

  // IS-MUSTED CHECKBOX
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

  // IS-ACTIVE RADIO
  activeRadiobox.classList.add("isactive-radio");
  activeRadiobox.addEventListener("change", (event: Event) => {
    console.log("event.currentTarget", event.target);
    handleTrackSelectChange(trackIndex, (event.target as HTMLInputElement).checked);
  });
  var activeRadioboxLabel = document.createElement("label");
  activeRadioboxLabel.setAttribute("for", `isactive-radio-${trackIndex}`);
  activeRadioboxLabel.classList.add("label-track-config-radio");
  labelCellDiv.appendChild(activeRadiobox);
  labelCellDiv.appendChild(activeRadioboxLabel);
  labelCell.classList.add("align-center");
  labelCell.appendChild(labelCellDiv);
  noteTableRow.appendChild(labelCell);

  // Now create n cells for n notes
  for (let i = 0; i < noteInputCount; i++) {
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
    lengthSlider.classList.add(`note_duration_slider_${trackIndex}`);
    lengthSlider.classList.add(`note_duration_slider_${trackIndex}-${i + 1}`);
    lengthSlider.value = "1.0";
    lengthSlider.step = "0.1";
    const noteDurationChangeHandler = (lengthSlider: HTMLInputElement, noteIndex: number) => {
      return () => handleNoteDurationChange(lengthSlider, noteIndex);
    };
    lengthSlider.addEventListener("input", noteDurationChangeHandler(lengthSlider, i));
    var sliderValueDisplay = document.createElement("span");
    sliderValueDisplay.innerHTML = "1.0";
    sliderValueDisplay.id = `note-length-display-${trackIndex}-${i + 1}`;
    sliderValueDisplay.classList.add("value-display");

    var noteFrquencyDisplay = document.createElement("div");
    noteFrquencyDisplay.classList.add("note-frequency-display");
    noteFrquencyDisplay.setAttribute("id", `note-frequency-display-${trackIndex}-${i}`);
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

const track2Preset = (track: Track): TrackPreset => {
  return {
    envelope: cloneObject(track.envelope),
    mainValues: cloneObject(track.mainValues),
    oscillator: cloneObject(track.oscillator),
    vibratoValues: cloneObject(track.vibratoValues),
    noteValues: track.currentNotes.map((noteConfig: NoteConfig) => {
      const note = getNoteByIndex(noteConfig.noteIndex);
      return { value: note ? note.identifier : "", lengthFactor: noteConfig.lengthFactor };
    })
    // isMuted: track.isMuted
  };
};

// const cloneArray = <T>(arr: Array<T>): Array<T> => {
//   return arr.map((elem: T) => elem);
// };
