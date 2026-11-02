//tbc

import { VoiceType, MusicalInstrument } from "src/types"

export const voiceTypeStartNoteMap: Record<VoiceType, string> = {
  "Soprano": "E4",
  "Mezzo-Soprano": "C4",
  "Alto": "A3",
  "Tenor": "C3",
  "Baritone": "G2",
  "Bass": "E2",
  "Not sure": "G3"
};

export const instrumentStartNoteMap: Record<MusicalInstrument, string> = {
  "Piano": "C4",
  "Violin": "D4",
  "Viola": "G3",
  "Cello": "D3",
  "Flute": "G4",
  "Clarinet": "G3",
  "Saxophone": "G3",
  "Trumpet": "G3",
  "Trombone": "F3",
  "Guitar": "G3"
};

export const vocalRangeNoteMap: Record<VoiceType, string> = {
  "Soprano": "C4-C6",
  "Mezzo-Soprano": "A3-A5",
  "Alto": "F3-F5",
  "Tenor": "C3-C5",
  "Baritone": "G2-G4",
  "Bass": "E2-E4",
  "Not sure": "C3-C5"
};

export const experienceScaleMap: Record<string, string> = {
    "Beginner": "Major (1-5)",
    "Intermediate": "Major",
    "Advanced": "Natural Minor"
};

export const experiencePitchToleranceMap: Record<string, "loose" | "standard" | "precise"> = {
    "Beginner": "loose",
    "Intermediate": "standard",
    "Advanced": "precise"
};

// export const instrumentFamilyStartNoteMap: Record<string, string> = {
//     "High Woodwinds": "G4",
//     "Low Woodwinds": "G3",
//     "Brass": "G3",
//     "Strings": "D4",
// }