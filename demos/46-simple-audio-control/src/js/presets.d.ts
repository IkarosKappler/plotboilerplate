import { NoteConfig, TrackPreset } from "./interfaces";
export declare const getPresetList: () => Record<string, TrackPreset>;
export declare const getDefaultPreset: () => TrackPreset;
/**
 * Convert a preset to an array of note settings.
 *
 * @param {number} NOTE_INPUT_COUNT
 * @param {*} preset - { envelope: ..., mainValues: ..., oscillator: ..., noteValues: Array<{ value: "F4", lengthFactor: 0.5 }>}
 * @returns Array<{ noteIndex: number, lengthFactor : number }>
 */
export declare const convertPresetToNotes: (NOTE_INPUT_COUNT: any, preset: any) => NoteConfig[];
