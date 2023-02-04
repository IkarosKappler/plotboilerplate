/**
 * @author  Ikaros Kappler
 * @version 1.0.0
 */
export interface Note {
    index: number;
    frequency: number;
    identifier: string;
}
export interface TrackPreset {
    envelope: {
        attackTime: number;
        releaseTime: number;
        noteLength: number;
        sustainLevel: number;
    };
    mainValues: {
        tempo: number;
        masterVolume: number;
    };
    oscillator: {
        waveform: "triangle" | "square" | "sine" | "sawtooth";
    };
    noteValues: Array<{
        value: string;
        lengthFactor: number;
    }>;
}
