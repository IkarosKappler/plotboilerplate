/**
 * @author  Ikaros Kappler
 * @version 1.0.0
 */
export interface Note {
    index: number;
    frequency: number;
    identifier: string;
}
export interface NoteConfig {
    noteIndex: number;
    lengthFactor: number;
}
export interface EnvelopeSettings {
    attackTime: number;
    releaseTime: number;
    noteLength: number;
    sustainLevel: number;
}
export interface MainSettings {
    tempo: number;
    masterVolume: number;
}
export interface TrackPreset {
    envelope: EnvelopeSettings;
    mainValues: MainSettings;
    oscillator: {
        waveform: "triangle" | "square" | "sine" | "sawtooth";
    };
    noteValues: Array<{
        value: string;
        lengthFactor: number;
    }>;
}
