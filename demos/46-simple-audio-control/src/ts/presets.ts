// Close encounters: https://johnloomis.org/ece303L/notes/music/Close_Encounters.html
// G-A-F-F-C

import { NoteConfig, TrackPreset } from "./interfaces";
import { locateNoteByIdentifier } from "./noteValues";

// This config MUST have 16 entries
const presetsCloseEncounters: TrackPreset = {
  envelope: { attackTime: 0.06, releaseTime: 0.3, noteLength: 1.0, sustainLevel: 0.8 },
  mainValues: { tempo: 120, masterVolume: 0.2 },
  oscillator: { waveform: "sine" },
  noteValues: [
    { value: "G4", lengthFactor: 1.0 },
    { value: "A4", lengthFactor: 1.0 },
    { value: "F4", lengthFactor: 1.0 },
    { value: "F3", lengthFactor: 3.0 },
    { value: "C4", lengthFactor: 0.0 },
    { value: "C4", lengthFactor: 2.0 },
    { value: "C4", lengthFactor: 0.0 },
    { value: "C4", lengthFactor: 0.0 },
    // 8/16
    { value: "G4", lengthFactor: 1.0 },
    { value: "A4", lengthFactor: 1.0 },
    { value: "F4", lengthFactor: 1.0 },
    { value: "F3", lengthFactor: 3.0 },
    { value: "C4", lengthFactor: 0.0 },
    { value: "C4", lengthFactor: 2.0 },
    { value: "C4", lengthFactor: 0.0 },
    { value: "C4", lengthFactor: 0.0 }
  ]
};

// Super Mario Jingle
// EGA FC E CD B
const presetsSuperMario: TrackPreset = {
  envelope: { attackTime: 0.06, releaseTime: 0.3, noteLength: 0.45, sustainLevel: 0.8 },
  mainValues: { tempo: 180, masterVolume: 0.2 },
  oscillator: { waveform: "sine" },
  noteValues: [
    { value: "C4", lengthFactor: 1.0 },
    { value: "G3", lengthFactor: 1.0 },
    { value: "E3", lengthFactor: 1.0 },
    { value: "A3", lengthFactor: 1.0 },
    { value: "B3", lengthFactor: 1.0 },
    { value: "A#3/Bb3", lengthFactor: 1.0 },
    { value: "A3", lengthFactor: 1.0 },
    { value: "G3", lengthFactor: 1.0 },
    // 8/16
    { value: "C4", lengthFactor: 1.0 },
    { value: "E3", lengthFactor: 1.0 },
    { value: "A4", lengthFactor: 0.0 },
    { value: "F4", lengthFactor: 0.0 },
    { value: "G4", lengthFactor: 0.0 },
    { value: "E4", lengthFactor: 0.0 },
    { value: "C4", lengthFactor: 0.0 },
    { value: "D4", lengthFactor: 0.0 }
  ]
};

// Ultravox Hymn
// E4 B3 F#4 B3 E4 D4 C4 D4 B3
const presetsUlravoxHymn: TrackPreset = {
  envelope: { attackTime: 0.06, releaseTime: 0.3, noteLength: 1.0, sustainLevel: 0.8 },
  mainValues: { tempo: 80, masterVolume: 0.2 },
  oscillator: { waveform: "sine" },
  noteValues: [
    { value: "E4", lengthFactor: 2.0 },
    { value: "E4", lengthFactor: 0.0 },
    { value: "B3", lengthFactor: 2.0 },
    { value: "B3", lengthFactor: 0.0 },
    { value: "F#4/Gb4", lengthFactor: 2.0 },
    { value: "F#4/Gb4", lengthFactor: 0.0 },
    { value: "B3", lengthFactor: 2.0 },
    { value: "B3", lengthFactor: 0.0 },
    // 8/16
    { value: "E4", lengthFactor: 2.0 },
    { value: "E4", lengthFactor: 0.0 },
    { value: "D4", lengthFactor: 1.0 },
    { value: "C4", lengthFactor: 1.0 },
    { value: "D4", lengthFactor: 2.0 },
    { value: "D4", lengthFactor: 0.0 },
    { value: "B3", lengthFactor: 1.0 },
    { value: "--", lengthFactor: 0.0 }
  ]
};

// Start Wars The Force
// ...
const presetsUTheForce: TrackPreset = {
  envelope: { attackTime: 0.36, noteLength: 2.8, releaseTime: 0.5, sustainLevel: 0.38 },
  mainValues: { tempo: 60, masterVolume: 0.2 },
  oscillator: { waveform: "sine" },
  noteValues: [
    { value: "G3", lengthFactor: 1.0 },
    { value: "C4", lengthFactor: 1.0 },
    { value: "D4", lengthFactor: 1.0 },
    { value: "D#4/Eb4", lengthFactor: 0.5 },
    { value: "F4", lengthFactor: 0.5 },
    { value: "D#4/Eb4", lengthFactor: 1.0 },
    { value: "G3", lengthFactor: 1.0 },
    // -- Pause
    { value: "G3", lengthFactor: 0.5 },
    // 8/16
    { value: "C4", lengthFactor: 1.0 },
    { value: "D4", lengthFactor: 0.5 },
    { value: "D#4/Eb4", lengthFactor: 0.5 },
    { value: "G3", lengthFactor: 0.5 },
    { value: "D#4/Eb4", lengthFactor: 0.5 },
    { value: "C4", lengthFactor: 0.5 },
    { value: "G4", lengthFactor: 0.5 },
    { value: "F4", lengthFactor: 1.0 }
  ]
};

// Mass Effect
// ...
const presetsMassEffect: TrackPreset = {
  envelope: { attackTime: 0.2, noteLength: 1.3, releaseTime: 0.5, sustainLevel: 0.38 },
  mainValues: { tempo: 60, masterVolume: 0.2 },
  oscillator: { waveform: "triangle" },
  noteValues: [
    { value: "G4", lengthFactor: 0.5 },
    { value: "G4", lengthFactor: 1.0 },
    { value: "D5", lengthFactor: 1.0 },
    { value: "G4", lengthFactor: 1.5 },
    { value: "F4", lengthFactor: 1.5 },
    { value: "--", lengthFactor: 0.0 },
    { value: "G4", lengthFactor: 1.0 },
    { value: "D5", lengthFactor: 0.5 },
    // 8/16
    { value: "G4", lengthFactor: 1.0 },
    { value: "D#4/Eb4", lengthFactor: 0.5 },
    // pause
    { value: "G4", lengthFactor: 0.5 },
    { value: "D5", lengthFactor: 0.5 },
    { value: "G4", lengthFactor: 0.5 },
    { value: "F4", lengthFactor: 0.5 },
    // pause
    { value: "E4", lengthFactor: 0.5 },
    { value: "F4", lengthFactor: 1.0 }
  ]
};

// The Riddle
// ...
const presetsTheRiddle: TrackPreset = {
  envelope: { attackTime: 0.2, noteLength: 1.0, releaseTime: 0.5, sustainLevel: 0.38 },
  mainValues: { tempo: 100, masterVolume: 0.2 },
  oscillator: { waveform: "triangle" },
  noteValues: [
    { value: "F4", lengthFactor: 0.5 },
    { value: "G4", lengthFactor: 1.0 },
    { value: "G#4/Ab4", lengthFactor: 1.0 },
    { value: "G#4/Ab4", lengthFactor: 1.5 },
    { value: "A#4/Bb4", lengthFactor: 1.0 },
    { value: "G#4/Ab4", lengthFactor: 1.0 },
    { value: "G4", lengthFactor: 1.0 },
    { value: "F4", lengthFactor: 0.5 },
    // 8/16
    { value: "D#4/Eb4", lengthFactor: 1.0 },
    { value: "D#4/Eb4", lengthFactor: 1.5 },
    // pause
    { value: "--", lengthFactor: 0.0 },
    { value: "F4", lengthFactor: 0.5 },
    { value: "G4", lengthFactor: 1.0 },
    { value: "G4", lengthFactor: 1.0 },
    // pause
    { value: "--", lengthFactor: 0.5 },
    { value: "--", lengthFactor: 1.0 }
  ]
};

// Le Chuck's Theme
// C C E G
const presetsLeChuck: TrackPreset = {
  envelope: { attackTime: 0.2, noteLength: 1.0, releaseTime: 0.5, sustainLevel: 0.38 },
  mainValues: { tempo: 100, masterVolume: 0.2 },
  oscillator: { waveform: "triangle" },
  noteValues: [
    { value: "C4", lengthFactor: 0.5 },
    { value: "C4", lengthFactor: 1.0 },
    { value: "E4", lengthFactor: 1.0 },
    { value: "G4", lengthFactor: 1.5 },
    { value: "F#4/Gb4", lengthFactor: 1.0 },
    { value: "F#4/Gb4", lengthFactor: 1.0 },
    { value: "D4", lengthFactor: 1.0 },
    { value: "--", lengthFactor: 0.5 },
    // 8/16
    { value: "F4", lengthFactor: 1.0 },
    { value: "F4", lengthFactor: 1.0 },
    { value: "F4", lengthFactor: 1.0 },
    { value: "D#4/Eb4", lengthFactor: 1.0 },
    { value: "C4", lengthFactor: 1.0 },
    { value: "C4", lengthFactor: 1.0 },
    { value: "C4", lengthFactor: 1.5 },
    { value: "--", lengthFactor: 0.0 }
  ]
};

// TODO: If I touch a burning candle
//

export const getPresetList = (): Record<string, TrackPreset> => {
  return {
    "Le Chuck": presetsLeChuck,
    "The Riddle": presetsTheRiddle,
    "Mass Effect": presetsMassEffect,
    "The Force": presetsUTheForce,
    "Close Encounters": presetsCloseEncounters,
    "Super Mario": presetsSuperMario,
    "Ulravox Hymn": presetsUlravoxHymn
  };
};

// This should match the with the index in NoteSelectHandler
export const getDefaultPreset = (): TrackPreset => {
  return presetsLeChuck;
};

/**
 * Convert a preset to an array of note settings.
 *
 * @param {number} NOTE_INPUT_COUNT
 * @param {*} preset - { envelope: ..., mainValues: ..., oscillator: ..., noteValues: Array<{ value: "F4", lengthFactor: 0.5 }>}
 * @returns Array<{ noteIndex: number, lengthFactor : number }>
 */
export const convertPresetToNotes = (NOTE_INPUT_COUNT, preset): NoteConfig[] => {
  // let currentNotes = [0, 3, 0, 7, 8, 7, 3, 2];
  var notes = new Array(NOTE_INPUT_COUNT).fill(0, 0, NOTE_INPUT_COUNT).map(function (value, index) {
    // Pick a note in the 4th or 5th ocate
    // C4 is at index 48
    // return 48 + Math.floor(Math.random() * 12);
    //   return { identifier: key, frequency: noteValues[key], index: index };
    return { noteIndex: locateNoteByIdentifier(preset[index].value), lengthFactor: preset[index].lengthFactor };
  });
  return notes;
};
