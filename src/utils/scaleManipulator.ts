
import { notes, scales} from '../NotesAndScales.ts';
import { Note, IntervalMap, IntervalSymbol } from '../types.ts';


export default function scaleManipulator() {

    function getScale(root: string, scaleType: keyof typeof scales, order?: number[]|null): Note[] {
        // get index of root note
        const rootIndex = notes.findIndex(note => note.name === root);
        // get scale intervals
        const intervals = scales[scaleType];
        // get scale notes
        const scale = intervals.map((interval,index) => {
            const noteIndex = rootIndex + interval;
            return {...notes[noteIndex], interval: calculateInterval(interval), position: index };
        });
        if (order && order.length === scale.length) {
            return reorderScale(scale, order);
        }
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
        return order.map(i => scale[i]);
    }

    //function to calculate interval from the distance to root note (in semitones)
    function calculateInterval(distance: number): IntervalSymbol {
        //use symbols e.g m2, M2, P4, etc.
        const intervals: IntervalMap = {
            0: 'P1',
            1: 'm2',
            2: 'M2',
            3: 'm3',
            4: 'M3',
            5: 'P4',
            6: 'd5',
            7: 'P5',
            8: 'm6',
            9: 'M6',
            10: 'm7',
            11: 'M7'
        };
        return intervals[distance] || 'P8';
    }

    return {
        reverseScale,
        shuffleScale,
        getScale,
        reorderScale
    };
}


