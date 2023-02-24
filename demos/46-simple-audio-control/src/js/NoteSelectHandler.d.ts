/**
 * Inspired by
 *    https://medium.com/geekculture/building-a-modular-synth-with-web-audio-api-and-javascript-d38ccdeca9ea
 *
 * @author   Ikaros Kappler
 * @date     2023-01-27
 * @modified 2023-02-04 Ported to Typescript.
 * @version  1.0.1
 */
import { Track, TrackPreset } from "./interfaces";
export declare class NoteSelectHandler {
    tracks: Array<Track>;
    trackCount: number;
    isTrackMuted: Array<boolean>;
    selectedTrackIndex: number;
    noteInputCount: number;
    private _onTrackSelected;
    private _noteSelects;
    private _noteLengthSliders;
    static DEFAULT_NOTE_INPUT_COUNT: number;
    constructor(initialPreset: TrackPreset, trackCount: number, onTrackSelected: (selectedTrack: Track, selectedTrackIndex: number) => void);
    private _createNoteSelectsDOM;
    setTrackCount(preset: TrackPreset, newTrackCount: number, newNoteInputCount: number): void;
    setCurrentNotesFromPreset(preset: TrackPreset): void;
    setFromPreset(preset: TrackPreset): void;
    setNoteSelects(): void;
    setCurrentNotes(): void;
    setCurrentNoteLengthInputs(): void;
    setCurrentNoteFreuqencyDisplays(): void;
    setCurrentNoteLengths(): void;
    setPlayingNoteDisplay(playingNoteIndex: number): void;
    setNoteLengthDisplay(trackIndex: number, noteIndex: number): void;
}
