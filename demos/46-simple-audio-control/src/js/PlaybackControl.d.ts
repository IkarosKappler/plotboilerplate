/**
 * A script to demonstrate how to animate beziers and curvature.
 *
 * I used this neat quick-tutorial of how to build a simple synthesizer:
 *    https://medium.com/geekculture/building-a-modular-synth-with-web-audio-api-and-javascript-d38ccdeca9ea
 *
 * @requires PlotBoilerplate
 * @requires MouseHandler
 * @requires gup
 * @requires dat.gui
 *
 * @author   Ikaros Kappler
 * @date     2023-02-24
 * @version  1.0.0
 **/
import { NoteSelectHandler } from "./NoteSelectHandler";
import { MainControls } from "./MainControls";
import { AudioControl } from "./AudioControl";
export declare class PlaybackControl {
    private mainControls;
    private noteSelectHandler;
    private currentNoteIndex;
    private isPlaying;
    constructor(audioControl: AudioControl, _mainControls: MainControls, _noteSelectHandler: NoteSelectHandler);
    resetLoop(): void;
}
