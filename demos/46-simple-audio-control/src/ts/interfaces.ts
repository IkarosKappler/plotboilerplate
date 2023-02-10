/**
 * @author  Ikaros Kappler
 * @version 1.0.0
 */

export interface Note {
  //   frequency: number;
  index: number; // The index in the noteValues array
  frequency: number;
  identifier: string; // The note's name
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
  oscillator: { waveform: "triangle" | "square" | "sine" | "sawtooth" };
  noteValues: Array<{ value: string; lengthFactor: number }>;
}

export interface Track extends Pick<TrackPreset, "envelope" | "mainValues" | "oscillator"> {
  currentNotes: Array<NoteConfig>;
}
