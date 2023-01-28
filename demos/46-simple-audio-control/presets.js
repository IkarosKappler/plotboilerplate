// Close encounters: https://johnloomis.org/ece303L/notes/music/Close_Encounters.html
// G-A-F-F-C
// This config MUST have 16 entries
var presetsCloseEncounters = {
  envelope: { attackTime: 0.06, noteLength: 1.0 },
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
var presetsSuperMario = {
  envelope: { attackTime: 0.06, noteLength: 0.45 },
  mainValues: { tempo: 180, masterVolume: 0.2 },
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
var presetsUlravoxHymn = {
  envelope: { attackTime: 0.06, noteLength: 1.0 },
  mainValues: { tempo: 80, masterVolume: 0.2 },
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

// Start Wars?
// Mass Effect?
//

function getPresetList() {
  return { "Close Encounters": presetsCloseEncounters, "Super Mario": presetsSuperMario, "Ulravox Hymn": presetsUlravoxHymn };
}

// This should match the with the index in NoteSelectHandler
function getDefaultPreset() {
  return presetsCloseEncounters;
}

var convertPresetToNotes = function (NOTE_INPUT_COUNT, preset) {
  // let currentNotes = [0, 3, 0, 7, 8, 7, 3, 2];
  var notes = new Array(NOTE_INPUT_COUNT).fill(0, 0, NOTE_INPUT_COUNT).map(function (value, index) {
    // Pick a note in the 4th or 5th ocate
    // C4 is at index 48
    // return 48 + Math.floor(Math.random() * 12);
    return { noteIndex: locateNoteByIdentifier(preset[index].value), lengthFactor: preset[index].lengthFactor };
  });
  return notes;
};
