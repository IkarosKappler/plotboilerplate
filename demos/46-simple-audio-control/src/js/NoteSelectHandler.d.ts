/**
 * Inspired by
 *    https://medium.com/geekculture/building-a-modular-synth-with-web-audio-api-and-javascript-d38ccdeca9ea
 *
 * @author   Ikaros Kappler
 * @date     2023-01-27
 * @modified 2023-02-04 Ported to Typescript.
 * @version  1.0.1
 */
import { NotesIOFormat, Track, TrackPreset } from "./interfaces";
export declare class NoteSelectHandler {
    tracks: Array<Track>;
    trackCount: number;
    selectedTrackIndex: number;
    noteInputCount: number;
    private _onTrackSelected;
    private _noteSelects;
    private _noteLengthSliders;
    static DEFAULT_NOTE_INPUT_COUNT: number;
    constructor(initialPreset: TrackPreset, trackCount: number, onTrackSelected: (selectedTrack: Track, selectedTrackIndex: number) => void);
    getNotesIOFormat(): NotesIOFormat;
    /**
     * Create/Recreate the whole note selector table DOM.
     *
     * @param {TrackPreset} preset
     * @param {number} noteInputCount
     */
    private _createNoteSelectsDOM;
    setTrackCount(preset: TrackPreset, newTrackCount: number, newNoteInputCount: number): void;
    setCurrentNotesFromPreset(preset: TrackPreset): void;
    setFromPreset(preset: TrackPreset): void;
    setNoteSelects(): void;
    setCurrentNotes(): void;
    setCurrentNoteLengthInputs(): void;
    /**
     * Update all displays for note length.
     */
    setCurrentNoteFreuqencyDisplays(): void;
    /**
     * Set the stored note length from the settings in the note sliders.
     */
    setCurrentNoteLengths(): void;
    setPlayingNoteDisplay(playingNoteIndex: number): void;
    setNoteLengthDisplay(trackIndex: number, noteIndex: number): void;
}
