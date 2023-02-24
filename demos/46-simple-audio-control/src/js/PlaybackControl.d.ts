/**
 * Playback controls.
 *
 * @author   Ikaros Kappler
 * @date     2023-02-24
 * @version  1.0.0
 **/
import { NoteSelectHandler } from "./NoteSelectHandler";
import { MainControls } from "./MainControls";
export declare class PlaybackControl {
    private mainControls;
    private noteSelectHandler;
    private currentNoteIndex;
    private isPlaying;
    constructor(_mainControls: MainControls, _noteSelectHandler: NoteSelectHandler);
    resetLoop(): void;
}
