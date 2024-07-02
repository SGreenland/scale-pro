import { Note } from './types';
import { Scales } from './types';

export const notes: Note[] = [];
const noteNames: string[] = ['C', 'Csharp', 'D', 'Dsharp', 'E', 'F', 'Fsharp', 'G', 'Gsharp', 'A', 'Asharp', 'B'];
const octaves: number[] = [2, 3, 4, 5, 6, 7];

for (const octave of octaves) {
    for (const noteName of noteNames) {
        const note: Note = {
            name: `${noteName}${octave}`,
            audioSrc: `src/assets/audio/${noteName}${octave}.mp3`,
        };
        notes.push(note);
    }
}
export const scales: Scales = {
    'Major': [0, 2, 4, 5, 7, 9, 11, 12],
    'Minor': [0, 2, 3, 5, 7, 8, 10, 12],
    'Harmonic Minor': [0, 2, 3, 5, 7, 8, 11, 12],
    'Minor Pentatonic': [0, 3, 5, 7, 10, 12],
};