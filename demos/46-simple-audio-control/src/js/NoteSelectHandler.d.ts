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
    currentNotes: Array<NoteConfig>;
    _noteSelects: NodeListOf<HTMLSelectElement>;
    _noteLengthSliders: NodeListOf<HTMLInputElement>;
    static NOTE_INPUT_COUNT: number;
    constructor(initialPreset: TrackPreset);
    setFromPreset(preset: TrackPreset): void;
    setNoteSelects(): void;
    setCurrentNotes(): void;
    setCurrentNoteLengthInputs(): void;
    setCurrentNoteLengths(): void;
    setPlayingNoteIndex(noteIndex: any): void;
}
