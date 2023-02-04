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

export interface TrackPreset {
  envelope: EnvelopeSettings;
  mainValues: { tempo: number; masterVolume: number };
  oscillator: { waveform: "triangle" | "square" | "sine" | "sawtooth" };
  noteValues: Array<{ value: string; lengthFactor: number }>;
}
