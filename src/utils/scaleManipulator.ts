
import { notes, scales} from '../NotesAndScales.ts';
import { Note } from '../types.ts';


export default function scaleManipulator() {

    function getScale(root: string, scaleType: keyof typeof scales): Note[] {
        // get index of root note
        const rootIndex = notes.findIndex(note => note.name === root);
        // get scale intervals
        const intervals = scales[scaleType];
        // get scale notes
        const scale = intervals.map(interval => {
            const noteIndex = rootIndex + interval;
            return notes[noteIndex];
        });
        return scale;

    }

    function reverseScale(scale: Note[]) {
        // @ts-ignore
        return scale.map((note: Note, i: number) => {
            return scale[scale.length - 1 - i];
        });
    }

    function shuffleScale(scale: Note[]) {
        return scale.sort(() => Math.random() - 0.5);
    }

    function reorderScale(scale: Note[], order: number[]) {
        // subtract 1 from each order element to make it zero based
        order = order.map(i => i - 1);
        return order.map(i => scale[i]);
    }


    return {
        reverseScale,
        shuffleScale,
        getScale,
        reorderScale
    };
}


