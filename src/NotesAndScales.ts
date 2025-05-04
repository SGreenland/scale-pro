import { Note, Scales, GuitarPosition, FretBoard } from './types';

export const notes: Note[] = [];
const noteNames: string[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const octaves: number[] = [2, 3, 4, 5, 6, 7];

const fretboard: FretBoard = {
    6: [ "E2", "F2", "F#2", "G2", "G#2", "A2", "A#2", "B2", "C3", "C#3", "D3", "D#3", "E3" ],
    5: [ "A2", "A#2", "B2", "C3", "C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3", "A3" ],
    4: [ "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3", "C4", "C#4", "D4" ],
    3: [ "G3", "G#3", "A3", "A#3", "B3", "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4" ],
    2: [ "B3", "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4" ],
    1: [ "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4", "C5", "C#5", "D5", "D#5", "E5" ]
  };


  function findNotePositions(noteName: string): GuitarPosition[] {
    const positions: GuitarPosition|any[]= [];

    for (const stringNum in fretboard) {
      const frets = fretboard[stringNum];
      frets.forEach((note, fretNum) => {
        if (note === noteName) {
          positions.push({ string: parseInt(stringNum), fret: fretNum });
        }
      });
    }

    return positions;
  }

for (const octave of octaves) {
    for (const noteName of noteNames) {
        const note: Note = {
            name: `${noteName}${octave}`,
            position: 0,
            interval: 'P1',
            audioSrc: `/assets/audio/${noteName.replace('#', 'sharp')}${octave}.mp3`,
            guitarPositions: findNotePositions(`${noteName}${octave}`),
        };
        notes.push(note);
    }
}
export const scales: Scales = {
    'Major': [0, 2, 4, 5, 7, 9, 11, 12],
    'Major (1-5)': [0, 2, 4, 5, 7],
    'Minor': [0, 2, 3, 5, 7, 8, 10, 12],
    'Harmonic Minor': [0, 2, 3, 5, 7, 8, 11, 12],
    'Minor Pentatonic': [0, 3, 5, 7, 10, 12],
    'Major Arpeggio': [0, 4, 7, 12],
    'Minor Arpeggio': [0, 3, 7, 12],
    'Diminished Arpeggio': [0, 3, 6, 12],
    'Augmented Arpeggio': [0, 4, 8, 12],
};



