/**
 * Inspired by
 *    https://medium.com/geekculture/building-a-modular-synth-with-web-audio-api-and-javascript-d38ccdeca9ea
 *
 * @author  Ikaros Kappler
 * @date    2023-01-27
 * @modified 2023-02-04 Ported to Typescript.
 * @version 1.0.1
 */
import { NoteConfig, TrackPreset } from "./interfaces";
export declare class NoteSelectHandler {
    currentNotes: Array<NoteConfig[]>;
    trackCount: number;
    isTrackMuted: Array<boolean>;
    private _noteSelects;
    private _noteLengthSliders;
    static NOTE_INPUT_COUNT: number;
    constructor(initialPreset: TrackPreset, trackCount?: number);
    private _createNoteSelectsDOM;
    setTrackCount(preset: TrackPreset, newTrackCount: number): void;
    setCurrentNotesFromPreset(preset: TrackPreset): void;
    setFromPreset(preset: TrackPreset): void;
    setNoteSelects(): void;
    setCurrentNotes(): void;
    setCurrentNoteLengthInputs(): void;
    setCurrentNoteLengths(): void;
    setPlayingNoteIndex(noteIndex: number): void;
    setNoteLengthDisplay(trackIndex: number, noteIndex: number): void;
}
