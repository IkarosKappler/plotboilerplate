/**
 * @author   Ikaros Kappler
 * @date     2023-01-22
 * @modified 2023-02-24
 * @version  1.0.0
 **/
import { NoteSelectHandler } from "./NoteSelectHandler";
export declare class AudioControl {
    noteSelectHandler: NoteSelectHandler;
    private envelopeHandler;
    private setTrackCount;
    private setNoteInputCount;
    constructor(GUP: Record<string, string>, isDarkmode: boolean);
}
