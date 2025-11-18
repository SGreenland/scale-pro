export interface Scales {
  "Major": number[];
  "Major (1-5)": number[];
  "Natural Minor": number[];
  "Harmonic Minor": number[];
  "Minor Pentatonic": number[];
  "Major Arpeggio": number[];
  "Minor Arpeggio": number[];
  "Diminished Arpeggio": number[];
  "Augmented Arpeggio": number[];
}

export interface NotePattern {
  name: string;
  pattern: number[];
  type: 'scale' | 'arpeggio' | 'interval';
}

export type LoopGapOption = "None" | "Auto" | "Custom";

export interface Settings {
  startingRootNote: string;
  startingScale: NotePattern;
  theme: "auto" | "dark" | "light";
  gridType: "Guitar tab" | "Piano roll";
  loopGap: LoopGapOption;
  loopGapCustom: number;
  autoShuffle: boolean;
  autoIncrementPitch?: boolean;
  autoStopPitchTracking?: boolean;
  minDetectionVolume: "sensitive" | "normal";
  pitchToleranceLevel: "loose" | "standard" | "precise";
}