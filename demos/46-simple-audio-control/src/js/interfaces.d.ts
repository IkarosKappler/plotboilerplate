/**
 * @author  Ikaros Kappler
 * @version 1.0.0
 */
export declare type Waveform = "triangle" | "square" | "sine" | "sawtooth";
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
export declare type FrquencyModulation = "full-linear" | "gaussian";
export interface TrackPreset {
    envelope: EnvelopeSettings;
    mainValues: MainSettings;
    oscillator: {
        waveform: Waveform;
    };
    noteValues: Array<{
        value: string;
        lengthFactor: number;
    }>;
    vibratoValues: {
        amount: number;
        speed: number;
        modulation: FrquencyModulation;
    };
}
export interface Track extends Pick<TrackPreset, "envelope" | "mainValues" | "oscillator" | "vibratoValues"> {
    currentNotes: Array<NoteConfig>;
    isMuted: boolean;
}
export interface NotesIOFormat {
    tracks: Array<TrackPreset>;
    trackCount: number;
    isTrackMuted: Array<boolean>;
    noteInputCount: number;
}
export interface DelayIOFormat {
    amount: number;
    time: number;
    feedback: number;
}
export interface AudioIOFormat {
    version: string;
    globalSettings: {
        mainSettings: MainSettings;
        delaySettings: DelayIOFormat;
    };
    notes: NotesIOFormat;
}
