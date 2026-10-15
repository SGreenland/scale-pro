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

export const experienceScaleMap: Record<string, string> = {
    "Beginner": "Major (1-5)",
    "Intermediate": "Major",
    "Advanced": "Natural Minor"
};

// export const instrumentFamilyStartNoteMap: Record<string, string> = {
//     "High Woodwinds": "G4",
//     "Low Woodwinds": "G3",
//     "Brass": "G3",
//     "Strings": "D4",
// }