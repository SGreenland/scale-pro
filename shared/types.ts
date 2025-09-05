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

export type LoopGapOption = "None" | "Auto" | "Custom";

export type Settings = {
  startingRootNote: string;
  startingScale: keyof Scales;
  theme: "auto" | "dark" | "light";
  gridType: "Guitar tab" | "Piano roll";
  loopGap: LoopGapOption;
  loopGapCustom: number;
  autoShuffle: boolean;
  minDetectionVolume: "sensitive" | "normal";
  pitchToleranceLevel: "loose" | "standard" | "precise";
}