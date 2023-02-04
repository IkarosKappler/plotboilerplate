import { TrackPreset } from "./interfaces";
export declare const getPresetList: () => {
    "The Riddle": TrackPreset;
    "Mass Effect": TrackPreset;
    "The Force": TrackPreset;
    "Close Encounters": TrackPreset;
    "Super Mario": TrackPreset;
    "Ulravox Hymn": TrackPreset;
};
export declare const getDefaultPreset: () => TrackPreset;
/**
 * Convert a preset to an array of note settings.
 *
 * @param {number} NOTE_INPUT_COUNT
 * @param {*} preset - { envelope: ..., mainValues: ..., oscillator: ..., noteValues: Array<{ value: "F4", lengthFactor: 0.5 }>}
 * @returns Array<{ noteIndex: number, lengthFactor : number }>
 */
export declare const convertPresetToNotes: (NOTE_INPUT_COUNT: any, preset: any) => {
    noteIndex: number;
    lengthFactor: any;
}[];
