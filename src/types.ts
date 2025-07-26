interface Note {
  name: string;
  interval: IntervalSymbol;
  position: number;
  guitarPositions: GuitarPosition[];
  audioSrc: string;
  currentGtrPositionIndex: number;
  frequency: number; // Optional property for frequency
}

interface GuitarPosition {
  string: number;
  fret: number;
}

interface Scales {
  Major: number[];
  "Major (1-5)": number[];
  Minor: number[];
  "Harmonic Minor": number[];
  "Minor Pentatonic": number[];
  "Major Arpeggio": number[];
  "Minor Arpeggio": number[];
  "Diminished Arpeggio": number[];
  "Augmented Arpeggio": number[];
}

type LoopGapOption = "None" | "Auto" | "Custom";

interface ScaleConfig {
  selectedScale: keyof Scales;
  selectedNote: string;
  noteOrder: number[] | null;
  currentGtrPositions: number[];
}

type IntervalSymbol =
  | "P1"
  | "m2"
  | "M2"
  | "m3"
  | "M3"
  | "P4"
  | "d5"
  | "P5"
  | "m6"
  | "M6"
  | "m7"
  | "M7"
  | "P8";

interface IntervalMap {
  [key: number]: IntervalSymbol;
}

interface Settings {
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

interface PresetNoteOrders {
  presets8: number[];
  presets6: number[];
}

interface PlayBackOptions {
  shouldLoop: boolean;
  isRoundTrip: boolean;
}

interface WorkoutConfig {
  startNote: string;
  endNote: string;
  // scale: keyof Scales;
  roundTrip: boolean;
  multiScale: boolean;
  scales: string[];
  noteOrder: number[] | null;
}

interface FretBoard {
  [stringNum: number]: string[];
}

export type {
  Note,
  Scales,
  PresetNoteOrders,
  PlayBackOptions,
  WorkoutConfig,
  ScaleConfig,
  LoopGapOption,
  IntervalMap,
  IntervalSymbol,
  GuitarPosition,
  FretBoard,
  Settings,
};
