/**
 * @author   Ikaros Kappler
 * @date     2023-01-22
 * @modified 2023-02-24
 * @version  1.0.0
 **/
import { NoteSelectHandler } from "./NoteSelectHandler";
import { AudioIOFormat } from "./interfaces";
export declare class AudioControl {
    noteSelectHandler: NoteSelectHandler;
    private envelopeHandler;
    private setTrackCount;
    private setNoteInputCount;
    getIOFormat: () => AudioIOFormat;
    setFromIO: (audioData: AudioIOFormat) => void;
    delay: DelayNode;
    constructor(GUP: Record<string, string>, isDarkmode: boolean);
}
